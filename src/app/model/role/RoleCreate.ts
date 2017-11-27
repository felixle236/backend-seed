import {sealed} from '../../../helpers/InjectionHelper'; // eslint-disable-line
import IRole from './interfaces/IRole'; // eslint-disable-line

@sealed
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

export default RoleCreate;
