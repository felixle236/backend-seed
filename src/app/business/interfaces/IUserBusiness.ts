import IBaseBusiness from './base/IBaseBusiness';
import User from '../../model/user/User';
import UserAuthentication from '../../model/user/UserAuthentication';
import UserPermission from '../../model/user/UserPermission';

interface IUserBusiness extends IBaseBusiness<User> {
    getList(name?: string, page?: number, limit?: number): Promise<User[]>;
    count(name?: string): Promise<number>;
    get(_id: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    getPermission(_id: string): Promise<UserPermission | undefined>;
    getUserByToken(token: string): Promise<UserAuthentication | undefined>;
    authenticate(email: string, password: string): Promise<UserAuthentication | undefined>;
    validateEmail(email: string): Promise<boolean>;
    signup(data: any): Promise<UserAuthentication | undefined>;
    create(data: any): Promise<User | undefined>;
    updateRole(_id: string, role: string): Promise<boolean>;
    updateClaims(_id: string, claims: string[]): Promise<boolean>;
    initialUsers(data: {isRequired: boolean, data: any}[], isRequired: boolean): Promise<boolean>;
    initialUserRoles(data: {isRequired: boolean, data: any}[], isRequired: boolean): Promise<boolean>;
}

export default IUserBusiness;
