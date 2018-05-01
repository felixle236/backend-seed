import IRole from './interfaces/IRole'; // eslint-disable-line

class RoleUpdate {
    name: string;
    level: number;

    constructor(model: IRole) {
        if (!model)
            return;

        this.name = model.name;
        this.level = model.level;
    }
}

Object.seal(RoleUpdate);
export default RoleUpdate;
