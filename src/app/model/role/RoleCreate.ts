import IRole from './interfaces/IRole'; // eslint-disable-line

class RoleCreate {
    code: number;
    name: string;
    level: number;

    constructor(model: IRole) {
        if (!model)
            return;

        this.code = model.code;
        this.name = model.name;
        this.level = model.level;
    }
}

Object.seal(RoleCreate);
export default RoleCreate;
