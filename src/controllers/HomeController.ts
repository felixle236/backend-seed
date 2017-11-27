import {inject} from '../helpers/InjectionHelper';
import BaseController from './base/BaseController';
import UserBusiness from '../app/business/UserBusiness';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import RoleBusiness from '../app/business/RoleBusiness';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';

class HomeController extends BaseController {
    @inject(UserBusiness)
    private userBusiness: IUserBusiness;
    @inject(RoleBusiness)
    private roleBusiness: IRoleBusiness;

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
