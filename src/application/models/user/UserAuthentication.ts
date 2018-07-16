import IUser from './interfaces/IUser'; // eslint-disable-line
import RoleLookup from '../role/RoleLookup';
import UserToken from './UserToken';
import UserProfile from './UserProfile';
import DataHelper from '../../../helpers/DataHelper';

export default class UserAuthentication {
    public id: string;
    public profile: UserProfile;
    public role: string | RoleLookup;
    public token: UserToken;

    public constructor(data: IUser | undefined) {
        if (!data)
            return;

        this.id = data.id;
        this.profile = new UserProfile(data);
        this.role = DataHelper.handleDataModel(data.role, RoleLookup);
        this.token = new UserToken(data.token);
    }
}
