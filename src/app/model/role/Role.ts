import IRole from './interfaces/IRole'; // eslint-disable-line

class Role {
    _id: string;
    name: string;
    order?: number;
    claims?: string[];

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IRole) {
        if (!model)
            return;

        this._id = model._id && model._id.toString();
        this.name = model.name;
        this.order = model.order;
        this.claims = model.claims;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IRole[]): Role[] {
        return list.map(item => new Role(item));
    }
}

Object.seal(Role);
export default Role;
