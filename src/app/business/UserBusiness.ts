import * as validator from 'validator';
import * as crypto from 'crypto';
import RoleBusiness from './RoleBusiness'; // eslint-disable-line
import IRoleBusiness from './interfaces/IRoleBusiness'; // eslint-disable-line
import IUserBusiness from './interfaces/IUserBusiness'; // eslint-disable-line
import UserRepository from '../repository/UserRepository';
import User from '../model/user/User';
import IUser from '../model/user/interfaces/IUser'; // eslint-disable-line
import UserCreate from '../model/user/UserCreate'; // eslint-disable-line
import UserUpdate from '../model/user/UserUpdate'; // eslint-disable-line
import UserAuthentication from '../model/user/UserAuthentication';
import UserToken from '../model/user/UserToken';
import UserPermission from '../model/user/UserPermission';
import {LoginProvider} from '../model/common/CommonType';
import DateHelper from '../../helpers/DateHelper';
import Project from '../../config/Project';
import Authenticator from '../../system/Authenticator';
import MailHelper from '../../helpers/MailHelper';
import {ErrorCommon} from '../model/common/Error';

class UserBusiness implements IUserBusiness {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getUsers(name?: string, page?: number, limit?: number): Promise<User[]> {
        let param = {
            query: <any>{}
        };
        if (name)
            param.query.name = new RegExp(name, 'i');

        let users = await this.userRepository.find(param, {name: 1}, page, limit);
        return User.parseArray(users);
    }

    async countUsers(name?: string): Promise<number> {
        let param = {
            query: <any>{}
        };
        if (name)
            param.query.name = new RegExp(name, 'i');

        return await this.userRepository.getCount(param);
    }

    async get(_id: string): Promise<User | null> {
        if (!_id)
            return null;

        let user = await this.userRepository.get(_id);
        return user && new User(user);
    }

    async authenticate(email: string, password: string): Promise<UserAuthentication | null> {
        if (!email || !validator.isEmail(email) || !password)
            throw new ErrorCommon(101, 'Email or password');

        let param = {
            query: {
                email: email.trim().toLowerCase(),
                password: hashPassword(password)
            }
        };
        let user = await this.userRepository.findOne(param);

        if (!user)
            throw new ErrorCommon(108, 'Email or password');

        if (!user.token || user.token.provider !== LoginProvider.Local || !user.token.accessToken || !user.token.tokenExpire || user.token.tokenExpire < new Date())
            user.token = await this.updateUserToken(user._id, new UserToken(<any>{provider: LoginProvider.Local}));

        return new UserAuthentication(user);
    }

    async getUserByToken(token: string): Promise<UserAuthentication | null> {
        if (!token)
            return null;

        let param = {
            query: {
                'token.accessToken': token,
                'token.tokenExpire': {
                    $gt: new Date()
                }
            }
        };
        let user = await this.userRepository.findOne(param);
        return user && new UserAuthentication(user);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        if (!email)
            return null;

        let param = {
            query: {
                email: email.trim().toLowerCase()
            }
        };
        let user = await this.userRepository.findOne(param);
        return user && new User(user);
    }

    async getPermission(_id: string): Promise<UserPermission | null> {
        if (!_id)
            return null;

        let user = await this.userRepository.get(_id);
        return user && new UserPermission(user);
    }

    async validateEmail(email: string, isCheckExists?: boolean): Promise<boolean> {
        if (!email)
            throw new ErrorCommon(105, 'Email');
        else if (!validator.isEmail(email))
            throw new ErrorCommon(101, 'Email');

        email = email.trim().toLowerCase();
        if (isCheckExists) {
            let param = {
                query: {
                    email
                }
            };
            if (await this.userRepository.findOne(param))
                throw new ErrorCommon(104, 'Email');
        }
        if (!email.endsWith('@localhost.com') && !(await MailHelper.checkRealEmail(email)))
            throw new ErrorCommon(108, 'Email');

        return true;
    }

    async signup(data: any): Promise<UserAuthentication> {
        let user: any = await this.create(data);
        if (user)
            user.token = await this.updateUserToken(user._id, new UserToken(<any>{provider: LoginProvider.Local}));
        return user && new UserAuthentication(user);
    }

    async create(data: any): Promise<User> {
        let user;
        let dataCreate = new UserCreate(data);

        if (validateName(dataCreate.name) && await this.validateEmail(dataCreate.email, true) && dataCreate.password && validatePassword(dataCreate.password)) {
            dataCreate.password = hashPassword(dataCreate.password);
            user = await this.userRepository.create(dataCreate);
        }
        else
            throw new ErrorCommon(101, 'Data');
        return user && new User(user);
    }

    async update(_id: string, data: any): Promise<User | null> {
        let user;
        let dataUpdate = new UserUpdate(data);

        if (validateName(dataUpdate.name)) {
            user = await this.userRepository.findOneAndUpdate({_id}, dataUpdate);
            if (user)
                Authenticator.removeAuthenticator(_id);
        }

        return user && new User(user);
    }

    private async updateUserToken(_id: string, token: UserToken): Promise<UserToken> {
        token.accessToken = createAccessToken();
        token.tokenExpire = DateHelper.addDays(new Date(), Project.EXPIRE_DAYS);

        await this.userRepository.findOneAndUpdate({_id}, {token});
        Authenticator.removeAuthenticator(_id);
        return token;
    }

    async updateRoles(_id: string, roles: string[]): Promise<boolean> {
        Authenticator.removeAuthenticator(_id);
        return await this.userRepository.update(_id, {roles});
    }

    async updateClaims(_id: string, claims: string[]): Promise<boolean> {
        Authenticator.removeAuthenticator(_id);
        return await this.userRepository.update(_id, {claims});
    }

    async delete(_id: string): Promise<boolean> {
        Authenticator.removeAuthenticator(_id);
        return await this.userRepository.delete(_id);
    }
}

function validateName(name: string): boolean {
    if (!name)
        throw new ErrorCommon(105, 'Name');
    else if (name.trim().length < 4)
        throw new ErrorCommon(201, 'name', 4);

    return true;
}

function validatePassword(password: string | undefined): boolean {
    if (!password)
        throw new ErrorCommon(105, 'Password');

    if (password.length < 6)
        throw new ErrorCommon(201, 'password', 6);

    // let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
    // if (!regExp.test(password))
    //     throw new ErrorCommon(4);

    return true;
}

function hashPassword(password: string) {
    if (password)
        return crypto.createHash('md5').update('$$' + password).digest('hex');
    return '';
}

function createAccessToken() {
    return crypto.randomBytes(64).toString('hex').substr(0, 128);
}

Object.seal(UserBusiness);
export default UserBusiness;
