import IUser from '../../models/user/interfaces/IUser'; // eslint-disable-line

interface ICachingBusiness {
    fetchPermissionCaching(): Promise<number>;
    checkPermission(role: string, claim: number): Promise<boolean>;
    getUserByToken(token: string): Promise<IUser | undefined>;
    createUser(data: any): Promise<IUser>;
    deleteUser(id: string): Promise<boolean>;
}

export default ICachingBusiness;
