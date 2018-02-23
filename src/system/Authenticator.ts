import * as express from 'express';
import UserAuthentication from '../app/model/user/UserAuthentication';
import BusinessLoader from '../system/BusinessLoader';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import DataLoader from './DataLoader';
import DateHelper from '../helpers/DateHelper';

class Authenticator {
    private app: any;
    private userBusiness: IUserBusiness = BusinessLoader.userBusiness;
    static readonly userKey = 'authUser';
    // Store list user login in memory
    private static authenticators: {expire: Date, userAuth: UserAuthentication}[] = [];

    constructor() {
        this.app = express();

        this.app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                let expandTime = 10; // minutes
                let token = <string>req.headers['authorization'];
                let auth = Authenticator.authenticators.find(a => a.expire && a.expire >= new Date() && a.userAuth && a.userAuth.token && a.userAuth.token.accessToken === token);

                if (!auth) {
                    let userAuth = await this.userBusiness.getUserByToken(token);

                    if (userAuth) {
                        auth = Authenticator.authenticators.find(a => a.userAuth && a.userAuth._id === userAuth!._id);
                        if (auth) {
                            auth.expire = DateHelper.addMinutes(new Date(), expandTime);
                            auth.userAuth = userAuth;
                        }
                        else {
                            auth = {
                                expire: DateHelper.addMinutes(new Date(), expandTime),
                                userAuth: userAuth
                            };
                            Authenticator.authenticators.push(auth);
                        }
                    }
                }
                req[Authenticator.userKey] = auth ? auth.userAuth : null;
            }
            catch (err) {
                console.error(err.message);
            }
            next();
        });
    }

    getConfig() {
        return this.app;
    }

    // Use to remove authenticator in memory after modify info that relate to authentication
    static removeAuthenticator(userId: string) {
        let index = Authenticator.authenticators.findIndex(a => a.userAuth && a.userAuth._id === userId);
        if (index !== -1)
            Authenticator.authenticators.splice(index, 1);
    }

    static isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): void {
        if (req[Authenticator.userKey])
            next();
        else {
            res.status(401);
            res.send({error: {message: 'Unauthorized'}});
        }
    }

    static checkHandlerRoles(userAuth: UserAuthentication, ...roleNames: string[]): boolean {
        if (userAuth && userAuth.permission && userAuth.permission.roles) {
            roleNames = roleNames.map(roleName => roleName.toLowerCase());

            let roleIds: string[] = DataLoader.roles.filter(role => {
                return roleNames.includes(role.name.toLowerCase());
            }).map(role => role._id);

            for (let i = 0; i < roleIds.length; i++) {
                if (userAuth.permission.roles.find(roleId => roleId === roleIds[i]))
                    return true;
            }
        }
        return false;
    }

    static checkRoles(...roleNames: string[]): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            let userAuth: UserAuthentication = req[Authenticator.userKey];
            if (Authenticator.checkHandlerRoles(userAuth, ...roleNames))
                next();
            else
                Authenticator.accessDenied(res);
        };
    }

    static checkHandlerClaims(userAuth: UserAuthentication, ...claims: string[]): boolean {
        if (userAuth && userAuth.permission && (userAuth.permission.roles || userAuth.permission.claims)) {
            let userClaims: string[] = userAuth.permission.claims || [];

            if (userAuth.permission.roles) {
                DataLoader.roles.filter(role => {
                    return userAuth.permission.roles!.findIndex(roleId => roleId === role._id) !== -1;
                }).forEach(role => {
                    userClaims.concat(role.claims || []);
                });
            }

            userClaims = userClaims.map(userClaim => userClaim.toLowerCase());

            for (let i = 0; i < claims.length; i++) {
                if (userClaims.includes(claims[i].toLowerCase()))
                    return true;
            }
        }

        return false;
    }

    static checkClaims(...claims: string[]): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            let userAuth: UserAuthentication = req[Authenticator.userKey];
            if (Authenticator.checkHandlerClaims(userAuth, ...claims))
                next();
            else
                Authenticator.accessDenied(res);
        };
    }

    static accessDenied(res: express.Response): void {
        res.status(403);
        res.send({error: {message: 'Access denied!'}});
    }
}

Object.seal(Authenticator);
export default Authenticator;
