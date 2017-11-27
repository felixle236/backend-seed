import {inject} from '../helpers/InjectionHelper';
import BaseController from './base/BaseController';
import RoleBusiness from '../app/business/RoleBusiness';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';
import RoleCreate from '../app/model/role/RoleCreate';
import RoleUpdate from '../app/model/role/RoleUpdate';
import Authenticator from '../system/Authenticator';

class RoleController extends BaseController {
    @inject(RoleBusiness)
    private roleBusiness: IRoleBusiness;

    constructor() {
        super();

        this.get('/search', this.validatePagination(), this.searchRoles.bind(this));
        this.get('/search-count', this.getCountSearchRoles.bind(this));
        this.get('/:_id', this.getRoleById.bind(this));
        this.post('/', Authenticator.checkRoles('Administrator'), this.createRole.bind(this));
        this.put('/:_id', Authenticator.checkRoles('Administrator'), this.updateRole.bind(this));
        this.delete('/:_id', Authenticator.checkRoles('Administrator'), this.deleteRole.bind(this));
    }

    async searchRoles(req): Promise<any> {
        return await this.roleBusiness.search(req.query.name, req.query.page, req.query.limit);
    }

    async getCountSearchRoles(req): Promise<any> {
        return await this.roleBusiness.getCountSearch(req.query.name);
    }

    async getRoleById(req): Promise<any> {
        return await this.roleBusiness.get(req.params._id);
    }

    async createRole(req): Promise<any> {
        return await this.roleBusiness.create(new RoleCreate(req.body));
    }

    async updateRole(req): Promise<any> {
        return await this.roleBusiness.update(req.params._id, new RoleUpdate(req.body));
    }

    async deleteRole(req): Promise<any> {
        return await this.roleBusiness.delete(req.params._id);
    }
}

Object.seal(RoleController);
export default RoleController;
