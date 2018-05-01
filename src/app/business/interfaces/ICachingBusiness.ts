import Role from '../../model/role/Role';
import UserAuthentication from '../../model/user/UserAuthentication';

interface ICachingBusiness {
    fetchDataRole(): Promise<boolean>;
    getRoles(): Promise<Role[]>;
    getRole(_id: string): Promise<Role | undefined>;
    getRolesByIds(ids: string[]): Promise<Role[]>;
    getRoleByCode(code: number): Promise<Role | undefined>
    getUserAuthenticationByToken(token: string): Promise<UserAuthentication | undefined>;
    createRole(data: any): Promise<boolean>;
    createUserAuthentication(data: any): Promise<boolean>;
    deleteUserAuthentication(_id: string): Promise<boolean>;
}

export default ICachingBusiness;
