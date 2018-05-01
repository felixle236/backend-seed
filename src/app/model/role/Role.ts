import IRole from './interfaces/IRole'; // eslint-disable-line
import DataHelper from '../../../helpers/DataHelper';

class Role {
    _id: string;
    code: number;
    name: string;
    level: number;
    claims: string[];

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IRole) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.code = model.code;
        this.name = model.name;
        this.level = model.level;
        this.claims = model.claims;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IRole[]): Role[] {
        return list && Array.isArray(list) ? list.map(item => new Role(item)) : [];
    }
}

Object.seal(Role);
export default Role;
