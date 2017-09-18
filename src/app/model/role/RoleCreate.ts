import IRole from './interfaces/IRole'; // eslint-disable-line

class RoleCreate {
    name: string;
    order?: number;

    constructor(model: IRole) {
        if (!model)
            return;

        this.name = model.name;
        this.order = model.order;
    }
}

Object.seal(RoleCreate);
export default RoleCreate;
