import BaseController from './base/BaseController';
import CachingBusiness from '../app/business/CachingBusiness';

class CachingController extends BaseController {
    constructor() {
        super();

        this.get('/roles', this.getRoles.bind(this));
        this.get('/role/:_id', this.getRoleById.bind(this));
        this.get('/role-by-code', this.validateData({field: 'code', type: 'NUM'}), this.getRoleByCode.bind(this));
        this.get('/user-auth-by-token', this.getUserAuthenticationByToken.bind(this));

        this.post('/role-by-ids', this.getRolesByIds.bind(this));
        this.post('/fetch-data-role', this.fetchDataRole.bind(this));
        this.post('/role', this.createRole.bind(this));
        this.post('/user-auth', this.validateData({target: 'body', field: 'token.tokenExpire', type: 'DATE'}), this.createUserAuthentication.bind(this));

        this.delete('/user-auth/:_id', this.deleteUserAuthentication.bind(this));
    }

    async getRoles(req): Promise<any> {
        return await CachingBusiness.instance.getRoles();
    }

    async getRoleById(req): Promise<any> {
        return await CachingBusiness.instance.getRole(req.params._id);
    }

    async getRoleByCode(req): Promise<any> {
        return await CachingBusiness.instance.getRoleByCode(req.query.code);
    }

    async getUserAuthenticationByToken(req): Promise<any> {
        return await CachingBusiness.instance.getUserAuthenticationByToken(req.query.token);
    }

    async getRolesByIds(req): Promise<any> {
        return await CachingBusiness.instance.getRolesByIds(req.body.ids);
    }

    async fetchDataRole(req): Promise<any> {
        return await CachingBusiness.instance.fetchDataRole();
    }

    async createRole(req): Promise<any> {
        return await CachingBusiness.instance.createRole(req.body);
    }

    async createUserAuthentication(req): Promise<any> {
        return await CachingBusiness.instance.createUserAuthentication(req.body);
    }

    async deleteUserAuthentication(req): Promise<any> {
        return await CachingBusiness.instance.deleteUserAuthentication(req.params._id);
    }
}

Object.seal(CachingController);
export default CachingController;
