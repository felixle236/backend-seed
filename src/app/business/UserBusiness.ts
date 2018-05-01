import * as validator from 'validator';
import * as crypto from 'crypto';
import Project from '../../config/Project';
import Authenticator from '../../system/Authenticator';
import BusinessLoader from '../../system/BusinessLoader';
import IUserBusiness from './interfaces/IUserBusiness'; // eslint-disable-line
import UserRepository from '../repository/UserRepository';
import User from '../model/user/User';
import IUser from '../model/user/interfaces/IUser'; // eslint-disable-line
import UserCreate from '../model/user/UserCreate';
import UserUpdate from '../model/user/UserUpdate';
import UserAuthentication from '../model/user/UserAuthentication';
import UserToken from '../model/user/UserToken';
import UserPermission from '../model/user/UserPermission';
import DateHelper from '../../helpers/DateHelper';
import MailHelper from '../../helpers/MailHelper';
import {LoginProvider} from '../model/common/CommonType';
import {ErrorCommon} from '../model/common/Error';

class UserBusiness implements IUserBusiness {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getList(name?: string, page?: number, limit?: number): Promise<User[]> {
        let param = {
            query: <any>{
                deletedAt: {$exists: false}
            },
            populate: getPopulateCommon()
        };
        if (name)
            param.query.name = new RegExp(name, 'i');

        let users = await this.userRepository.find(param, {fullName: 1}, page, limit);
        return User.parseArray(users);
    }

    async count(name?: string): Promise<number> {
        let param = {
            query: <any>{
                deletedAt: {$exists: false}
            }
        };
        if (name)
            param.query.name = new RegExp(name, 'i');

        return await this.userRepository.count(param);
    }

    async get(_id: string): Promise<User | undefined> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');

        let user = await this.userRepository.get(_id, getPopulateCommon());
        return user && new User(user);
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        if (!email)
            throw new ErrorCommon(105, 'Email');

        let param = {
            query: {
                email: email.trim().toLowerCase(),
                deletedAt: {$exists: false}
            },
            populate: getPopulateCommon()
        };
        let user = await this.userRepository.findOne(param);
        return user && new User(user);
    }

    async getPermission(_id: string): Promise<UserPermission | undefined> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');

        let user = await this.userRepository.get(_id);
        return user && new UserPermission(user);
    }

    async getUserByToken(token: string): Promise<UserAuthentication | undefined> {
        if (!token)
            throw new ErrorCommon(105, 'Token');

        let param = {
            query: {
                'token.accessToken': token,
                'token.tokenExpire': {
                    $gt: new Date()
                },
                'deletedAt': {$exists: false}
            },
            populate: getPopulateCommon()
        };
        let user = await this.userRepository.findOne(param);
        return user && new UserAuthentication(user);
    }

    async authenticate(email: string, password: string): Promise<UserAuthentication | undefined> {
        if (!email)
            throw new ErrorCommon(105, 'Email');
        if (!validator.isEmail(email))
            throw new ErrorCommon(101, 'Email');
        if (!password)
            throw new ErrorCommon(105, 'Password');

        let param = {
            query: {
                email: email.trim().toLowerCase(),
                password: hashPassword(password),
                deletedAt: {$exists: false}
            },
            populate: getPopulateCommon()
        };
        let user = await this.userRepository.findOne(param);

        if (!user)
            throw new ErrorCommon(108, 'Email or password');

        if (user.role && user.role.claims) {
            user.role.claims.forEach(claim => {
                if (user && !user.claims.includes(claim))
                    user.claims.push(claim);
            });
        }

        if (!user.token || user.token.provider !== LoginProvider.Local || !user.token.accessToken || !user.token.tokenExpire || user.token.tokenExpire < new Date())
            user.token = await this.updateUserToken(user._id, new UserToken(<any>{provider: LoginProvider.Local}));

        let userAuth = new UserAuthentication(user);
        await Authenticator.addUserAuthenticated(userAuth);
        return userAuth;
    }

    async validateEmail(email: string, isCheckExists?: boolean, isCheckRealEmail?: boolean): Promise<boolean> {
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
        if (isCheckRealEmail && !email.endsWith('@localhost.com') && !(await MailHelper.checkRealEmail(email)))
            throw new ErrorCommon(108, 'Email');

        return true;
    }

    async signup(data: any): Promise<UserAuthentication | undefined> {
        if (!data)
            throw new ErrorCommon(101, 'Data');

        let user: any = await this.create(data);
        if (user)
            user.token = await this.updateUserToken(user._id, new UserToken(<any>{provider: LoginProvider.Local}));
        return user && new UserAuthentication(user);
    }

    async create(data: any): Promise<User | undefined> {
        if (!data)
            throw new ErrorCommon(101, 'Data');

        let user;
        let dataCreate = new UserCreate(data);

        validateName(<any>dataCreate);
        await this.validateEmail(dataCreate.email, true);
        validatePassword(dataCreate.password);

        dataCreate.password = hashPassword(dataCreate.password!);
        user = await this.userRepository.create(dataCreate);
        return user && new User(user);
    }

    async update(_id: string, data: any): Promise<boolean> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');
        if (!data)
            throw new ErrorCommon(101, 'Data');

        let user;
        let dataUpdate = new UserUpdate(data);

        validateName(<any>dataUpdate);
        user = await this.userRepository.findOneAndUpdate({_id}, dataUpdate);
        if (user)
            Authenticator.removeUserAuthenticated(_id);
        return true;
    }

    private async updateUserToken(_id: string, token: UserToken): Promise<UserToken> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');
        if (!token)
            throw new ErrorCommon(105, 'Token');

        token.accessToken = createAccessToken();
        token.tokenExpire = DateHelper.addDays(new Date(), Project.AUTHENTICATION_EXPIRES);

        await this.userRepository.findOneAndUpdate({_id}, {token});
        Authenticator.removeUserAuthenticated(_id);
        return token;
    }

    async updateRole(_id: string, roleId: string): Promise<boolean> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');
        if (!roleId)
            throw new ErrorCommon(101, 'Role id');

        Authenticator.removeUserAuthenticated(_id);
        return await this.userRepository.update(_id, {role: roleId});
    }

    async updateClaims(_id: string, claims: string[]): Promise<boolean> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');
        if (!claims)
            throw new ErrorCommon(105, 'Claims');

        Authenticator.removeUserAuthenticated(_id);
        return await this.userRepository.update(_id, {claims});
    }

    async delete(_id: string): Promise<boolean> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');

        Authenticator.removeUserAuthenticated(_id);
        return await this.userRepository.delete(_id);
    }

    async initialUsers(data: {isRequired: boolean, data: any}[], isRequired = false): Promise<boolean> {
        if (!data || !Array.isArray(data))
            throw new ErrorCommon(101, 'Data');

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.isRequired || isRequired) {
                await this.create(item.data).then(user => {
                    if (user)
                        console.log(`User '${item.data.email}' has created.`);
                }).catch(error => {
                    if (error.code && !error.code.toString().startsWith('COM'))
                        console.log(`User '${item.data.email}' cannot create with error`, error);
                });
            }
        }
        console.log('\x1b[32m', 'Initialize users have done.', '\x1b[0m');
        return true;
    }

    async initialUserRoles(data: {isRequired: boolean, data: any}[], isRequired = false): Promise<boolean> {
        if (!data || !Array.isArray(data))
            throw new ErrorCommon(101, 'Data');
        let roles = await BusinessLoader.roleBusiness.getAll();

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.isRequired || isRequired) {
                let user = await this.getUserByEmail(item.data.email);
                if (user && !user.role) {
                    let role = roles.find(role => role.code === item.data.roleCode);
                    if (role) {
                        await this.updateRole(user._id, role._id).catch(error => {
                            console.log(`User roles of '${user!.email}' cannot update with error`, error);
                        });
                        console.log(`User roles of '${user.email}' has updated.`);
                    }
                }
            }
        }
        console.log('\x1b[32m', 'Initialize user roles have done.', '\x1b[0m');
        return true;
    }
}

function getPopulateCommon() {
    return [{
        path: 'avatar',
        select: 'name url'
    }, {
        path: 'role',
        select: 'code name level claims'
    }];
}

function validateName(data: IUser): boolean {
    if (!data.firstName)
        throw new ErrorCommon(105, 'First name');
    else if (data.firstName.trim().length < 2)
        throw new ErrorCommon(201, 'First name', 2);
    else if (!data.lastName)
        throw new ErrorCommon(105, 'Last name');
    else if (data.lastName.trim().length < 2)
        throw new ErrorCommon(201, 'Last name', 2);

    return true;
}

function validatePassword(password: string | undefined, isHighLevel = false): boolean {
    if (!password)
        throw new ErrorCommon(105, 'Password');

    if (password.length < 6)
        throw new ErrorCommon(201, 'password', 6);

    if (isHighLevel) {
        let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
        if (!regExp.test(password))
            throw new ErrorCommon(4);
    }

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
