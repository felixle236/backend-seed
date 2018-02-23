import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';
import Authenticator from '../system/Authenticator';

class RoleController extends BaseController {
    private roleBusiness: IRoleBusiness = BusinessLoader.roleBusiness;

    constructor() {
        super();

        this.get('/list', this.validatePagination(10), this.getRoles.bind(this));
        this.get('/count', this.countRoles.bind(this));
        this.get('/:_id', this.getRoleById.bind(this));

        this.post('/', Authenticator.checkRoles('Administrator'), this.createRole.bind(this));
        this.put('/:_id', Authenticator.checkRoles('Administrator'), this.updateRole.bind(this));
        this.delete('/:_id', Authenticator.checkRoles('Administrator'), this.deleteRole.bind(this));
    }

    async getRoles(req): Promise<any> {
        return await this.roleBusiness.getRoles(req.query.name, req.query.page, req.query.limit);
    }

    async countRoles(req): Promise<any> {
        return await this.roleBusiness.countRoles(req.query.name);
    }

    async getRoleById(req): Promise<any> {
        return await this.roleBusiness.get(req.params._id);
    }

    async createRole(req): Promise<any> {
        return await this.roleBusiness.create(req.body);
    }

    async updateRole(req): Promise<any> {
        return await this.roleBusiness.update(req.params._id, req.body);
    }

    async deleteRole(req): Promise<any> {
        return await this.roleBusiness.delete(req.params._id);
    }
}

Object.seal(RoleController);
export default RoleController;
