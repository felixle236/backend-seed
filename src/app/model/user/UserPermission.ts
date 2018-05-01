import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class UserPermission {
    role?: any;
    claims: string[];

    constructor(model: IUser) {
        if (!model)
            return;

        this.role = DataHelper.handleIdDataModel(model.role);
        this.claims = model.claims;
    }
}

Object.seal(UserPermission);
export default UserPermission;
