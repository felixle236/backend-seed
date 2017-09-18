import IBaseBusiness from './base/IBaseBusiness';
import User from '../../model/user/User';
import UserCreate from '../../model/user/UserCreate'; // eslint-disable-line
import UserUpdate from '../../model/user/UserUpdate'; // eslint-disable-line
import UserLogin from '../../model/user/UserLogin';
import UserPermission from '../../model/user/UserPermission';

interface IUserBusiness extends IBaseBusiness<User> {
    getList: (page: number, limit: number) => Promise<User[]>;
    getCount: () => Promise<number>;
    getUserLogin: (email: string, password: string) => Promise<UserLogin | null>;
    getUserLoginByToken: (token: string) => Promise<UserLogin | null>;
    getByEmail: (email: string) => Promise<User | null>;
    getPermission: (_id: string) => Promise<UserPermission | null>;
    create: (data: UserCreate) => Promise<User>;
    update: (_id: string, data: UserUpdate) => Promise<User | null>;
    createUserLogin: (data: UserCreate) => Promise<UserLogin>;
    updateRoles: (_id: string, roles: string[]) => Promise<boolean>;
    updateClaims: (_id: string, claims: string[]) => Promise<boolean>;
}

export default IUserBusiness;
