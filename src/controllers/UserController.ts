import BaseController from './base/BaseController';
import UserBusiness from '../app/business/UserBusiness';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import UserCreate from '../app/model/user/UserCreate';
import UserUpdate from '../app/model/user/UserUpdate';
import UserLogin from '../app/model/user/UserLogin'; // eslint-disable-line
import Authenticator from '../system/Authenticator';

class UserController extends BaseController {
    private userBusiness: IUserBusiness = UserBusiness.Instance;

    constructor() {
        super();

        this.get('/list', this.validatePagination(), this.getUsers.bind(this));
        this.get('/list/count', this.getCountUsers.bind(this));
        this.get('/:_id', this.getUserById.bind(this));
        this.get('/profile', Authenticator.isAuthenticated, this.getProfile.bind(this));
        this.post('/signin', this.signin.bind(this));
        this.post('/signup', this.signup.bind(this));
        this.post('/', Authenticator.checkRoles('Administrator'), this.createUser.bind(this));
        this.put('/:_id', Authenticator.checkRoles('Administrator'), this.updateUser.bind(this));
        this.put('/profile', Authenticator.isAuthenticated, this.updateProfile.bind(this));
        this.delete('/:_id', Authenticator.checkRoles('Administrator'), this.deleteUser.bind(this));
    }

    async getUsers(req): Promise<any> {
        return await this.userBusiness.getList(req.query.page, req.query.limit);
    }

    async getCountUsers(req): Promise<any> {
        return await this.userBusiness.getCount();
    }

    async getUserById(req): Promise<any> {
        return await this.userBusiness.get(req.params._id);
    }

    async getProfile(req): Promise<any> {
        let userLogin: UserLogin = req[Authenticator.userKey];
        return await this.userBusiness.get(userLogin._id);
    }

    async signin(req): Promise<any> {
        return await this.userBusiness.getUserLogin(req.body.email, req.body.password);
    }

    async signup(req): Promise<any> {
        return await this.userBusiness.signup(new UserCreate(req.body));
    }

    async createUser(req): Promise<any> {
        return await this.userBusiness.create(new UserCreate(req.body));
    }

    async updateUser(req): Promise<any> {
        return await this.userBusiness.update(req.params._id, new UserUpdate(req.body));
    }

    async updateProfile(req): Promise<any> {
        let userLogin: UserLogin = req[Authenticator.userKey];
        return await this.userBusiness.update(userLogin._id, new UserUpdate(req.body));
    }

    async deleteUser(req): Promise<any> {
        return await this.userBusiness.delete(req.params._id);
    }
}

Object.seal(UserController);
export default UserController;
