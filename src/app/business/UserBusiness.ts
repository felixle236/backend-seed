import * as validator from 'validator';
import * as crypto from 'crypto';
import IUserBusiness from './interfaces/IUserBusiness'; // eslint-disable-line
import UserRepository from '../repository/UserRepository';
import User from '../model/user/User';
import IUser from '../model/user/interfaces/IUser'; // eslint-disable-line
import UserCreate from '../model/user/UserCreate'; // eslint-disable-line
import UserUpdate from '../model/user/UserUpdate'; // eslint-disable-line
import UserLogin from '../model/user/UserLogin';
import UserToken from '../model/user/UserToken';
import UserPermission from '../model/user/UserPermission';
import {LoginProvider} from '../model/common/CommonType';
import DateHelper from '../../helpers/DateHelper';
import Project from '../../config/Project';
import Authenticator from '../../system/Authenticator';
import MailHelper from '../../helpers/MailHelper';
import {ErrorCommon} from '../model/common/Error';

class UserBusiness implements IUserBusiness {
    private static instance: IUserBusiness = new UserBusiness();
    private userRepository: UserRepository;

    private constructor() {
        this.userRepository = new UserRepository();
    }

    public static get Instance() {
        return UserBusiness.instance;
    }

    async getList(page: number, limit: number): Promise<User[]> {
        let users = await this.userRepository.find(null, null, page, limit);
        return User.parseArray(users);
    }

    async getCount(): Promise<number> {
        return await this.userRepository.getCount();
    }

    async get(_id: string): Promise<User | null> {
        if (!_id)
            return null;

        let user = await this.userRepository.get(_id);
        return user && new User(user);
    }

    async getUserLogin(email: string, password: string): Promise<UserLogin | null> {
        if (!email || !validator.isEmail(email) || !password)
            throw new ErrorCommon(101, 'Email or password');

        email = email.trim().toLowerCase();
        let user = await this.userRepository.getUserLogin(email, hashPassword(password));

        if (!user)
            throw new ErrorCommon(108, 'Email or password');

        if (!user.token || user.token.provider !== LoginProvider.Local || !user.token.accessToken || !user.token.tokenExpire || user.token.tokenExpire < new Date())
            user.token = await this.updateUserToken(user._id, new UserToken(<any>{provider: LoginProvider.Local}));

        return new UserLogin(user);
    }

    async getUserLoginByToken(token: string): Promise<UserLogin | null> {
        if (!token)
            return null;

        let user = await this.userRepository.getByToken(token);
        return user && new UserLogin(user);
    }

    async getByEmail(email: string): Promise<User | null> {
        if (!email)
            return null;

        email = email.trim().toLowerCase();
        let user = await this.userRepository.findOne({email: email});
        return user && new User(user);
    }

    async getPermission(_id: string): Promise<UserPermission | null> {
        if (!_id)
            return null;

        let user = await this.userRepository.get(_id);
        return user && new UserPermission(user);
    }

    async validateEmail(email: string): Promise<boolean> {
        if (!email)
            throw new ErrorCommon(105, 'Email');
        else if (!validator.isEmail(email))
            throw new ErrorCommon(101, 'Email');

        email = email.trim().toLowerCase();
        if (await this.userRepository.checkEmailExists(email))
            throw new ErrorCommon(104, 'Email');
        if (!email.endsWith('@localhost.com') && !(await MailHelper.checkRealEmail(email)))
            throw new ErrorCommon(108, 'Email');

        return true;
    }

    async create(data: UserCreate): Promise<IUser> {
        let user;
        if (validateName(data.name) && await this.validateEmail(data.email) && data.password && validatePassword(data.password)) {
            data.password = hashPassword(data.password);
            user = await this.userRepository.create(data);
        }
        else
            throw new ErrorCommon(101, 'Data');
        return user;
    }

    async signup(data: UserCreate): Promise<UserLogin> {
        let user = await this.create(data);
        if (user)
            user.token = await this.updateUserToken(user._id, new UserToken(<any>{provider: LoginProvider.Local}));
        return user && new UserLogin(user);
    }

    async update(_id: string, data: UserUpdate): Promise<User | null> {
        let result;

        if (validateName(data.name)) {
            result = await this.userRepository.update(_id, data);
            if (result)
                Authenticator.removeAuthenticator(_id);
        }

        return result ? await this.get(_id) : null;
    }

    private async updateUserToken(_id: string, token: UserToken): Promise<UserToken> {
        token.accessToken = createAccessToken();
        token.tokenExpire = DateHelper.addDays(new Date(), Project.EXPIRE_DAYS);

        await this.userRepository.updateUserToken(_id, token);
        Authenticator.removeAuthenticator(_id);
        return token;
    }

    async updateRoles(_id: string, roles: string[]): Promise<boolean> {
        Authenticator.removeAuthenticator(_id);
        return await this.userRepository.updateRoles(_id, roles);
    }

    async updateClaims(_id: string, claims: string[]): Promise<boolean> {
        Authenticator.removeAuthenticator(_id);
        return await this.userRepository.updateClaims(_id, claims);
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
