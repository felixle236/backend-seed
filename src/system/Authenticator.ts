import * as express from 'express'; // eslint-disable-line
import UserBusiness from '../app/business/UserBusiness';
import UserAuthentication from '../app/model/user/UserAuthentication'; // eslint-disable-line
import CachingHelper from '../helpers/CachingHelper';

class Authenticator {
    static readonly userKey = 'userAuth';

    static async addUserAuthenticated(userAuth: UserAuthentication): Promise<void> {
        await CachingHelper.post(`/user-auth`, userAuth);
    }

    static async removeUserAuthenticated(userId: string): Promise<void> {
        await CachingHelper.delete(`/user-auth/${userId}`);
    }

    static async getUserAuthentication(req: express.Request): Promise<UserAuthentication | undefined> {
        let userAuth;
        let token = <string>req.headers['authorization'];

        try {
            if (token) {
                userAuth = await CachingHelper.get(`/user-auth-by-token?token=${token}`);
                if (!userAuth) {
                    userAuth = await UserBusiness.instance.getUserByToken(token);
                    if (userAuth)
                        await Authenticator.addUserAuthenticated(userAuth);
                }
            }
        }
        catch (err) {
            console.error(err.message);
        }
        req[Authenticator.userKey] = userAuth;
        return userAuth;
    }

    static isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
        Authenticator.getUserAuthentication(req).then(userAuth => {
            if (userAuth)
                next();
            else {
                res.status(401);
                res.send({error: {message: 'Unauthorized'}});
            }
        });
    }

    static checkRoles(...roleCodes: number[]): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            Authenticator.getUserAuthentication(req).then(userAuth => {
                if (userAuth && userAuth.permission && userAuth.permission.role && roleCodes.length && roleCodes.find(roleCode => userAuth!.permission.role.code === roleCode))
                    next();
                else
                    Authenticator.accessDenied(res);
            });
        };
    }

    static checkClaims(...claims: string[]): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            Authenticator.getUserAuthentication(req).then(userAuth => {
                if (userAuth) {
                    let userClaims: string[] = userAuth.permission.claims || [];
                    if (claims.find(claim => userClaims.includes(claim)))
                        return next();
                }
                Authenticator.accessDenied(res);
            });
        };
    }

    static accessDenied(res: express.Response): void {
        res.status(403);
        res.send({error: {message: 'Access denied!'}});
    }
}

Object.seal(Authenticator);
export default Authenticator;
