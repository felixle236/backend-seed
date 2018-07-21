import IUser from './interfaces/IUser'; // eslint-disable-line
import RoleLookup from '../role/RoleLookup';
import UserToken from './UserToken';
import UserProfile from './UserProfile';
import DataHelper from '../../../helpers/DataHelper';

export default class UserAuthentication {
    id: string;
    profile: UserProfile;
    role: string | RoleLookup;
    token: UserToken;

    constructor(data: IUser | undefined) {
        if (!data)
            return;

        this.id = data.id;
        this.profile = new UserProfile(data);
        this.role = DataHelper.handleDataModel(data.role, RoleLookup);
        this.token = new UserToken(data.token);
    }
}
