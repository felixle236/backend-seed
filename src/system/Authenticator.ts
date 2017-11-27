import * as express from 'express';
import {inject, sealed} from '../helpers/InjectionHelper'; // eslint-disable-line
import UserLogin from '../app/model/user/UserLogin';
import UserBusiness from '../app/business/UserBusiness';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import DataLoader from './DataLoader';
import DateHelper from '../helpers/DateHelper';

@sealed
class Authenticator {
    private app: any;
    @inject(UserBusiness)
    private userBusiness: IUserBusiness;
    static readonly userKey = 'authUser';
    // Store list user login in memory
    private static authenticators: {expire: Date, userLogin: UserLogin}[] = [];

    constructor() {
        this.app = express();

        this.app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                let expandTime = 10; // minutes
                let token = <string>req.headers['authorization'];
                let auth = Authenticator.authenticators.find(a => a.expire && a.expire >= new Date() && a.userLogin && a.userLogin.token && a.userLogin.token.accessToken === token);

                if (!auth) {
                    let userLogin = await this.userBusiness.getUserLoginByToken(token);

                    if (userLogin) {
                        auth = Authenticator.authenticators.find(a => a.userLogin && a.userLogin._id === userLogin!._id);
                        if (auth) {
                            auth.expire = DateHelper.addMinutes(new Date(), expandTime);
                            auth.userLogin = userLogin;
                        }
                        else {
                            auth = {
                                expire: DateHelper.addMinutes(new Date(), expandTime),
                                userLogin: userLogin
                            };
                            Authenticator.authenticators.push(auth);
                        }
                    }
                }
                req[Authenticator.userKey] = auth ? auth.userLogin : null;
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
        let index = Authenticator.authenticators.findIndex(a => a.userLogin && a.userLogin._id === userId);
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

    static checkHandlerRoles(userLogin: UserLogin, ...roleNames: string[]): boolean {
        if (userLogin && userLogin.permission && userLogin.permission.roles) {
            roleNames = roleNames.map(roleName => roleName.toLowerCase());

            let roleIds: string[] = DataLoader.roles.filter(role => {
                return roleNames.includes(role.name.toLowerCase());
            }).map(role => role._id);

            for (let i = 0; i < roleIds.length; i++) {
                if (userLogin.permission.roles.find(roleId => roleId === roleIds[i]))
                    return true;
            }
        }
        return false;
    }

    static checkRoles(...roleNames: string[]): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            let userLogin: UserLogin = req[Authenticator.userKey];
            if (Authenticator.checkHandlerRoles(userLogin, ...roleNames))
                next();
            else
                Authenticator.accessDenied(res);
        };
    }

    static checkHandlerClaims(userLogin: UserLogin, ...claims: string[]): boolean {
        if (userLogin && userLogin.permission && (userLogin.permission.roles || userLogin.permission.claims)) {
            let userClaims: string[] = userLogin.permission.claims || [];

            if (userLogin.permission.roles) {
                DataLoader.roles.filter(role => {
                    return userLogin.permission.roles!.findIndex(roleId => roleId === role._id) !== -1;
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
            let userLogin: UserLogin = req[Authenticator.userKey];
            if (Authenticator.checkHandlerClaims(userLogin, ...claims))
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

export default Authenticator;
