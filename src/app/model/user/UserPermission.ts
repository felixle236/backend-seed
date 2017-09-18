import User from '../../model/user/User'; // eslint-disable-line
import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line

class UserPermission {
    roles?: string[];
    claims?: string[];

    constructor(model: IUser) {
        if (!model)
            return;

        this.roles = model.roles;
        this.claims = model.claims;
    }
}

Object.seal(UserPermission);
export default UserPermission;
