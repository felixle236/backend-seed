import {sealed} from '../../../helpers/InjectionHelper'; // eslint-disable-line
import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line

@sealed
class UserPermission {
    roles: string[];
    claims?: string[];

    constructor(model: IUser) {
        if (!model)
            return;

        this.roles = model.roles ? model.roles.map(roleId => roleId.toString()) : [];
        this.claims = model.claims;
    }
}

export default UserPermission;
