import IBaseBusiness from './base/IBaseBusiness';
import User from '../../model/user/User';
import UserAuthentication from '../../model/user/UserAuthentication';
import UserPermission from '../../model/user/UserPermission';

interface IUserBusiness extends IBaseBusiness<User> {
    getUsers: (name?: string, page?: number, limit?: number) => Promise<User[]>;
    countUsers: (name?: string) => Promise<number>;
    authenticate: (email: string, password: string) => Promise<UserAuthentication | null>;
    getUserByToken: (token: string) => Promise<UserAuthentication | null>;
    getUserByEmail: (email: string) => Promise<User | null>;
    getPermission: (_id: string) => Promise<UserPermission | null>;
    validateEmail: (email: string) => Promise<boolean>;
    signup: (data: any) => Promise<UserAuthentication>;
    updateRoles: (_id: string, roles: string[]) => Promise<boolean>;
    updateClaims: (_id: string, claims: string[]) => Promise<boolean>;
}

export default IUserBusiness;
