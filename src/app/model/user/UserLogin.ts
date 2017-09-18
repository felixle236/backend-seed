import User from '../../model/user/User';
import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line
import UserPermission from '../../model/user/UserPermission';

class UserLogin {
    user: User;
    permission: UserPermission;
    accessToken: string;

    constructor(model: IUser) {
        if (!model)
            return;

        this.user = new User(model);
        this.permission = new UserPermission(model);
        this.accessToken = model.token ? model.token.accessToken : '';
    }
}

Object.seal(UserLogin);
export default UserLogin;
