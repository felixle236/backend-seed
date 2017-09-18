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
import LoginProvider from '../model/user/enums/LoginProvider';
import DateHelper from '../../helpers/DateHelper';
import Project from '../../config/Project';
import Authenticator from '../../system/Authenticator';

class UserBusiness implements IUserBusiness {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
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
            throw new Error('Email or password is invalid!');

        email = email.trim().toLowerCase();
        let user = await this.userRepository.getUserLogin(email, hashPassword(password));

        if (!user)
            throw new Error('Email or password is incorrect!');

        if (!user.token || user.token.provider != LoginProvider.Local || !user.token.accessToken || !user.token.tokenExpire || user.token.tokenExpire < new Date())
            user.token = await this.updateUserToken(user._id, new UserToken(LoginProvider.Local));

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

    async create(data: UserCreate): Promise<User> {
        let user;
        if (validateName(data.name) && validateEmail(data.email) && data.password && validatePassword(data.password))
            user = await this.createUserCommon(data);
        return user && new User(user);
    }

    async createUserLogin(data: UserCreate): Promise<UserLogin> {
        let user;
        if (validateName(data.name) && validateEmail(data.email) && validatePassword(data.password)) {
            user = await this.createUserCommon(data);
            user.token = await this.updateUserToken(user._id, new UserToken(LoginProvider.Local));
        }
        return user && new UserLogin(user);
    }

    private async createUserCommon(data: UserCreate): Promise<IUser> {
        if (data.password)
            data.password = hashPassword(data.password);

        if (await this.getByEmail(data.email))
            throw new Error('Email was already exists!');

        return await this.userRepository.create(data);
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
        throw new Error('Name is required!');
    else if (name.trim().length < 4)
        throw new Error('Minimum name is 4 characters!');

    return true;
}

function validateEmail(email: string): boolean {
    if (!email)
        throw new Error('Email is required!');
    else if (!validator.isEmail(email))
        throw new Error('Email is invalid!');

    return true;
}

function validatePassword(password: string | undefined): boolean {
    if (!password)
        throw new Error('Password is required!');
    else if (password.length < 6)
        throw new Error('Minimum password is 6 characters!');

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
