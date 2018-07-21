import {Container} from 'typedi';
import {Action} from 'routing-controllers'; // eslint-disable-line
import IUserBusiness from '../application/businesses/interfaces/IUserBusiness'; // eslint-disable-line
import UserBusiness from '../application/businesses/UserBusiness';
import IPermissionBusiness from '../application/businesses/interfaces/IPermissionBusiness'; // eslint-disable-line
import PermissionBusiness from '../application/businesses/PermissionBusiness';
import IUser from '../application/models/user/interfaces/IUser'; // eslint-disable-line
import CachingHelper from '../helpers/CachingHelper';
const userBusiness: IUserBusiness = Container.get(UserBusiness);
const permissionBusiness: IPermissionBusiness = Container.get(PermissionBusiness);

export default class Authenticator {
    static createUserCaching(user: IUser): Promise<IUser | undefined> {
        return CachingHelper.post('/user', user).catch(error => {
            console.log('Create user caching', error); // eslint-disable-line
        });
    }

    static deleteUserCaching(id: string): Promise<boolean> {
        return CachingHelper.delete(`/user/${id}`).catch(error => {
            console.log('Delete user caching', error); // eslint-disable-line
            return false;
        });
    }

    static async authorizationChecker(action: Action, claims: number[]) {
        let token = action.request.headers['authorization'];
        if (!token) return false;

        let user = await CachingHelper.get(`/user-by-token?token=${token}`).catch(error => {
            console.log('Get user caching by token', error); // eslint-disable-line
        });
        if (!user) {
            user = await userBusiness.getUserByToken(token).catch(() => undefined);
            if (user) await Authenticator.createUserCaching(user);
        }

        if (user && user.role) {
            user.id = user._id.toString();
            user.role.id = user.role._id.toString();
            action.request.user = user;

            if (!claims.length)
                return true;
            else {
                let claim = claims[0];
                let result = await CachingHelper.post('/check-permission', {role: user.role.id, claim}).catch(error => {
                    console.log('Check permission caching', error); // eslint-disable-line
                    return permissionBusiness.checkPermission(user.role.id, claim);
                });
                if (result) return true;
            }
        }
        return false;
    }

    static currentUserChecker(action: Action) {
        return action.request.user;
    }
}
