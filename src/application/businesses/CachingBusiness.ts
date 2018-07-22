import {Service, Inject} from 'typedi'; // eslint-disable-line
import CachingAccess from '../dataAccess/CachingAccess';
import ICachingBusiness from './interfaces/ICachingBusiness'; // eslint-disable-line
import IPermissionBusiness from './interfaces/IPermissionBusiness';
import PermissionBusiness from './PermissionBusiness';
import IUser from '../models/user/interfaces/IUser'; // eslint-disable-line
import {ValidationError} from '../models/common/Error';

@Service()
export default class CachingBusiness implements ICachingBusiness {
    @Inject(() => PermissionBusiness)
    private permissionBusiness: IPermissionBusiness; // eslint-disable-line

    fetchPermissionCaching(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            CachingAccess.permissions.remove({}, {multi: true}, async (error, numRemoved) => {
                if (error) return reject(error);

                let permissions = await this.permissionBusiness.getAll();
                permissions.forEach((permission: any) => { permission._id = permission.id; });
                CachingAccess.permissions.insert(permissions, (error) => {
                    if (error)
                        return reject(error);
                    resolve(permissions.length);
                });
            });
        });
    }

    checkPermission(role: string, claim: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            CachingAccess.permissions.findOne({
                role,
                claim
            }, (error, permission) => {
                if (error)
                    return reject(error);
                resolve(!!permission);
            });
        });
    }

    getUserByToken(token: string): Promise<IUser | undefined> {
        return new Promise<IUser | undefined>((resolve, reject) => {
            if (!token)
                return reject(new ValidationError(1));

            CachingAccess.users.findOne({
                'token.accessToken': token,
                'token.tokenExpire': {
                    $gt: new Date()
                }
            }, (error, user: IUser) => {
                if (error)
                    return reject(error);
                return resolve(user);
            });
        });
    }

    createUser(data: any): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            if (!data || !data._id)
                return reject(new ValidationError(1));

            data = JSON.parse(JSON.stringify(data));
            if (data.token && data.token.tokenExpire)
                data.token.tokenExpire = new Date(data.token.tokenExpire);

            CachingAccess.users.findOne({_id: data._id}, async (error, user: any) => {
                if (error)
                    return reject(error);

                if (user) {
                    data.expirationDate = user.expirationDate;
                    CachingAccess.users.update({_id: user._id}, data, {}, (error) => {
                        if (error)
                            return reject(error);
                        resolve(data);
                    });
                } else {
                    data.expirationDate = new Date();
                    CachingAccess.users.insert(data, (error, result) => {
                        if (error)
                            return reject(error);
                        resolve(result);
                    });
                }
            });
        });
    }

    deleteUser(_id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!_id)
                return reject(new ValidationError(1));

            CachingAccess.users.remove({_id}, {}, (error, numRemoved) => {
                if (error)
                    return reject(error);
                resolve(!!numRemoved);
            });
        });
    }
}
