import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';

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
        return await BusinessLoader.cachingBusiness.getRoles();
    }

    async getRoleById(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getRole(req.params._id);
    }

    async getRoleByCode(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getRoleByCode(req.query.code);
    }

    async getUserAuthenticationByToken(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getUserAuthenticationByToken(req.query.token);
    }

    async getRolesByIds(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.getRolesByIds(req.body.ids);
    }

    async fetchDataRole(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.fetchDataRole();
    }

    async createRole(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createRole(req.body);
    }

    async createUserAuthentication(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.createUserAuthentication(req.body);
    }

    async deleteUserAuthentication(req): Promise<any> {
        return await BusinessLoader.cachingBusiness.deleteUserAuthentication(req.params._id);
    }
}

Object.seal(CachingController);
export default CachingController;
