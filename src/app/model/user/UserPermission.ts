import User from '../../model/user/User'; // eslint-disable-line
import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line
import DataLoader from '../../../system/DataLoader';

class UserPermission {
    roles: {_id: string, name: string}[];
    claims?: string[];

    constructor(model: IUser) {
        if (!model)
            return;

        this.roles = model.roles ? model.roles.map(_id => ({_id: _id.toString(), name: ''})) : [];
        this.roles.forEach(role => {
            let roleCache = DataLoader.roles.find(r => r._id.toString() === role._id);
            if (roleCache)
                role.name = roleCache.name;
        });
        this.claims = model.claims;
    }
}

Object.seal(UserPermission);
export default UserPermission;
