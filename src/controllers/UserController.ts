import BaseController from './base/BaseController';
import UserBusiness from '../app/business/UserBusiness';
import UserAuthentication from '../app/model/user/UserAuthentication'; // eslint-disable-line
import Authenticator from '../system/Authenticator';
import {RoleCode} from '../app/model/common/CommonType';

class UserController extends BaseController {
    constructor() {
        super();

        this.get('/list', this.validatePagination(10), this.getUsers.bind(this));
        this.get('/count', this.countUsers.bind(this));
        this.get('/:_id', this.getUserById.bind(this));
        this.get('/profile', Authenticator.isAuthenticated, this.getProfile.bind(this));

        this.post('/signin', this.signin.bind(this));
        this.post('/signup', this.signup.bind(this));
        this.post('/', Authenticator.checkRoles(RoleCode.Administrator), this.createUser.bind(this));

        this.put('/:_id', Authenticator.checkRoles(RoleCode.Administrator), this.updateUser.bind(this));
        this.put('/profile', Authenticator.isAuthenticated, this.updateProfile.bind(this));

        this.delete('/:_id', Authenticator.checkRoles(RoleCode.Administrator), this.deleteUser.bind(this));
    }

    async getUsers(req): Promise<any> {
        return await UserBusiness.instance.getList(req.query.name, req.query.page, req.query.limit);
    }

    async countUsers(req): Promise<any> {
        return await UserBusiness.instance.count(req.query.name);
    }

    async getUserById(req): Promise<any> {
        return await UserBusiness.instance.get(req.params._id);
    }

    async getProfile(req): Promise<any> {
        let userAuth: UserAuthentication = req[Authenticator.userKey];
        return await UserBusiness.instance.get(userAuth._id);
    }

    async signin(req): Promise<any> {
        return await UserBusiness.instance.authenticate(req.body.email, req.body.password);
    }

    async signup(req): Promise<any> {
        return await UserBusiness.instance.signup(req.body);
    }

    async createUser(req): Promise<any> {
        return await UserBusiness.instance.create(req.body);
    }

    async updateUser(req): Promise<any> {
        return await UserBusiness.instance.update(req.params._id, req.body);
    }

    async updateProfile(req): Promise<any> {
        let userAuth: UserAuthentication = req[Authenticator.userKey];
        return await UserBusiness.instance.update(userAuth._id, req.body);
    }

    async deleteUser(req): Promise<any> {
        return await UserBusiness.instance.delete(req.params._id);
    }
}

Object.seal(UserController);
export default UserController;
