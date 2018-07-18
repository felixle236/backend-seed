import IUser from '../../models/user/interfaces/IUser';
import UserView from '../../models/user/UserView';
import UserProfile from '../../models/user/UserProfile';
import UserAuthentication from '../../models/user/UserAuthentication';
import ResultList from '../../models/common/ResultList';

interface IUserBusiness {
    find(keyword?: string, page?: number, limit?: number): Promise<ResultList<UserView>>;
    get(id: string): Promise<UserView | undefined>;

    /**
     * Only use for Authentication
     * @param {string} token access token
     * @returns {IUser | undefined}
     */
    getUserByToken(token: string): Promise<IUser | undefined>;
    getProfile(id: string): Promise<UserProfile | undefined>;
    authenticate(email: string, password: string): Promise<UserAuthentication>;
    signup(data: any): Promise<UserAuthentication | undefined>;
    update(id: string, data: any): Promise<boolean>;
    updatePassword(id: string, password: string, newPassword: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    initialUsers(data: {isRequired: boolean, data: any}[], isRequired: boolean): Promise<boolean>;
}

export default IUserBusiness;
