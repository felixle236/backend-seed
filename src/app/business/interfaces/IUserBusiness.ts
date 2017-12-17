import IBaseBusiness from './base/IBaseBusiness';
import User from '../../model/user/User';
import UserCreate from '../../model/user/UserCreate'; // eslint-disable-line
import UserUpdate from '../../model/user/UserUpdate'; // eslint-disable-line
import UserAuthentication from '../../model/user/UserAuthentication';
import UserPermission from '../../model/user/UserPermission';

interface IUserBusiness extends IBaseBusiness<User> {
    search: (name?: string, page?: number, limit?: number) => Promise<User[]>;
    getCountSearch: (name?: string) => Promise<number>;
    authenticate: (email: string, password: string) => Promise<UserAuthentication | null>;
    getByToken: (token: string) => Promise<UserAuthentication | null>;
    getByEmail: (email: string) => Promise<User | null>;
    getPermission: (_id: string) => Promise<UserPermission | null>;
    validateEmail: (email: string) => Promise<boolean>;
    create: (data: UserCreate) => Promise<User>;
    signup: (data: UserCreate) => Promise<UserAuthentication>;
    update: (_id: string, data: UserUpdate) => Promise<User | null>;
    updateRoles: (_id: string, roles: string[]) => Promise<boolean>;
    updateClaims: (_id: string, claims: string[]) => Promise<boolean>;
}

export default IUserBusiness;
