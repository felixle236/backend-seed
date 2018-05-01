import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';
import Authenticator from '../system/Authenticator';
import {RoleCode, Claim} from '../app/model/common/CommonType';

class RoleController extends BaseController {
    private roleBusiness: IRoleBusiness = BusinessLoader.roleBusiness;

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
        return await this.roleBusiness.getList(req.query.name, req.query.page, req.query.limit);
    }

    async countRoles(req): Promise<any> {
        return await this.roleBusiness.count(req.query.name);
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
