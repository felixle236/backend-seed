import {sealed} from '../../../helpers/InjectionHelper'; // eslint-disable-line
import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line
import UserToken from './UserToken';
import UserProfile from '../../model/user/UserProfile';
import UserPermission from '../../model/user/UserPermission';

@sealed
class UserLogin {
    _id: string;
    profile: UserProfile;
    permission: UserPermission;
    token: UserToken;

    constructor(model: IUser) {
        if (!model)
            return;

        this._id = model._id && model._id.toString();
        this.profile = new UserProfile(model);
        this.permission = new UserPermission(model);
        this.token = new UserToken(model.token!);
    }
}

export default UserLogin;
