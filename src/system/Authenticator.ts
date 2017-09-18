import * as express from 'express';
import UserCreate from '../app/model/user/UserCreate';
import UserLogin from '../app/model/user/UserLogin';
import UserBusiness from '../app/business/UserBusiness';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import DataLoader from './DataLoader';
import DateHelper from '../helpers/DateHelper';

class Authenticator {
    private app: any;
    private userBusiness: IUserBusiness = new UserBusiness();
    static userKey = 'user_login';
    // Store list user login in memory
    private static authenticators: {expire: Date, userLogin: UserLogin}[] = [];

    constructor() {
        this.app = express();

        this.app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                let expandTime = 10; // minutes
                let token = <string>req.headers['authorization'];
                let auth = Authenticator.authenticators.find(a => a.expire && a.expire >= new Date() && a.userLogin && a.userLogin.accessToken == token);

                if (!auth) {
                    let userLogin = await this.userBusiness.getUserLoginByToken(token);

                    if (userLogin) {
                        auth = Authenticator.authenticators.find(a => a.userLogin && a.userLogin.user && a.userLogin.user._id == userLogin!.user._id);
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

        this.app.post('/api/signin', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                let userLogin = await this.userBusiness.getUserLogin(req.body.email, req.body.password);
                res.send({data: userLogin});
            }
            catch (err) {
                res.send({error: {message: err.message}});
            }
        });

        this.app.post('/api/signup', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                let userLogin = await this.userBusiness.createUserLogin(new UserCreate(req.body));
                res.send({data: userLogin});
            }
            catch (err) {
                res.send({error: {message: err.message}});
            }
        });
    }

    getConfig() {
        return this.app;
    }

    // Use to remove authenticator in memory after modify info that relate to authentication
    static removeAuthenticator(userId: string) {
        let index = Authenticator.authenticators.findIndex(a => a.userLogin && a.userLogin.user && a.userLogin.user._id == userId);
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

    static isRoles(userLogin: UserLogin, ...roleNames: string[]): boolean {
        if (userLogin && userLogin.permission && userLogin.permission.roles) {
            roleNames = roleNames.map(roleName => roleName.toLowerCase());

            let roleIds: string[] = DataLoader.roles.filter(role => {
                return roleNames.includes(role.name.toLowerCase());
            }).map(role => role._id);

            for (let i = 0; i < roleIds.length; i++) {
                if (userLogin.permission.roles.includes(roleIds[i]))
                    return true;
            }
        }

        return false;
    }

    static isHandlerRoles(...roleNames: string[]): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            let userLogin: UserLogin = req[Authenticator.userKey];
            if (Authenticator.isRoles(userLogin, ...roleNames))
                next();
            else
                Authenticator.accessDenied(res);
        };
    }

    static isClaims(userLogin: UserLogin, ...claims: string[]): boolean {
        if (userLogin && userLogin.permission && (userLogin.permission.roles || userLogin.permission.claims)) {
            let userClaims: string[] = userLogin.permission.claims || [];

            if (userLogin.permission.roles) {
                DataLoader.roles.filter(role => {
                    return userLogin.permission.roles!.includes(role._id);
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

    static isHandlerClaims(...claims: string[]): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            let userLogin: UserLogin = req[Authenticator.userKey];
            if (Authenticator.isClaims(userLogin, ...claims))
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
