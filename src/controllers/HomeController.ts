import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';

class HomeController extends BaseController {
    private userBusiness: IUserBusiness = BusinessLoader.userBusiness;
    private roleBusiness: IRoleBusiness = BusinessLoader.roleBusiness;

    constructor() {
        super();

        this.get('/test-users', this.getUsers.bind(this));
        this.get('/test-roles', this.getRoles.bind(this));
    }

    async getUsers(): Promise<any> {
        return await this.userBusiness.search('', 1, 1000);
    }

    async getRoles(): Promise<any> {
        return await this.roleBusiness.getAll();
    }
}

Object.seal(HomeController);
export default HomeController;
