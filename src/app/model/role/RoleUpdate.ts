import IRole from './interfaces/IRole'; // eslint-disable-line

class RoleUpdate {
    name: string;
    order?: number;

    constructor(model: IRole) {
        if (!model)
            return;

        this.name = model.name;
        this.order = model.order;
    }
}

Object.seal(RoleUpdate);
export default RoleUpdate;
