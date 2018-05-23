import BaseController from './base/BaseController';
import RoleBusiness from '../app/business/RoleBusiness';
import Authenticator from '../system/Authenticator';
import {RoleCode, Claim} from '../app/model/common/CommonType';

class RoleController extends BaseController {
    constructor() {
        super();

        this.get('/list', this.validatePagination(10), this.getRoles.bind(this));
        this.get('/count', this.countRoles.bind(this));
        this.get('/:_id', this.getRoleById.bind(this));

        this.post('/', Authenticator.checkClaims(Claim.FULL_ACCESS), this.createRole.bind(this));
        this.put('/:_id', Authenticator.checkRoles(RoleCode.Administrator), this.updateRole.bind(this));
        this.delete('/:_id', Authenticator.checkRoles(RoleCode.Administrator), this.deleteRole.bind(this));
    }

    async getRoles(req): Promise<any> {
        return await RoleBusiness.instance.getList(req.query.name, req.query.page, req.query.limit);
    }

    async countRoles(req): Promise<any> {
        return await RoleBusiness.instance.count(req.query.name);
    }

    async getRoleById(req): Promise<any> {
        return await RoleBusiness.instance.get(req.params._id);
    }

    async createRole(req): Promise<any> {
        return await RoleBusiness.instance.create(req.body);
    }

    async updateRole(req): Promise<any> {
        return await RoleBusiness.instance.update(req.params._id, req.body);
    }

    async deleteRole(req): Promise<any> {
        return await RoleBusiness.instance.delete(req.params._id);
    }
}

Object.seal(RoleController);
export default RoleController;
