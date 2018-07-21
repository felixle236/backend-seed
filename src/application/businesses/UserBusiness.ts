import * as crypto from 'crypto';
import {Validator} from 'class-validator';
import {Container, Service, Inject} from 'typedi'; // eslint-disable-line
import config from '../../configuration';
import Authenticator from '../../system/Authenticator';
import UserRepository from '../repositories/UserRepository';
import IUserBusiness from './interfaces/IUserBusiness'; // eslint-disable-line
import IRoleBusiness from './interfaces/IRoleBusiness';
import RoleBusiness from './RoleBusiness';
import IUser from '../models/user/interfaces/IUser'; // eslint-disable-line
import UserView from '../models/user/UserView';
import UserToken from '../models/user/UserToken';
import UserProfile from '../models/user/UserProfile';
import UserAuthentication from '../models/user/UserAuthentication';
import {LoginProvider, RoleCode, GenderType} from '../models/common/CommonType';
import {ValidationError} from '../models/common/Error';
import ResultList from '../models/common/ResultList';
import DateHelper from '../../helpers/DateHelper';
import DataHelper from '../../helpers/DataHelper';
const validator = Container.get(Validator);

@Service()
export default class UserBusiness implements IUserBusiness {
    @Inject()
    private userRepository: UserRepository;
    @Inject(() => RoleBusiness)
    private roleBusiness: IRoleBusiness;

    async find(keyword?: string, page?: number, limit?: number): Promise<ResultList<UserView>> {
        let resultList = new ResultList<UserView>(page, limit);
        let param = {
            query: {
                deletedAt: {$exists: false}
            } as any,
            populate: ['avatar', 'role'],
            page,
            limit
        };

        if (keyword) {
            let regex = new RegExp(keyword.trim(), 'i');
            param.query.$or = [{
                fullName: regex
            }, {
                email: regex
            }];
        }

        let users = await this.userRepository.find(param);
        resultList.results = UserView.parseArray(users);
        resultList.pagination.total = await this.userRepository.count(param);
        return resultList;
    }

    async get(id: string): Promise<UserView | undefined> {
        if (!validator.isMongoId(id))
            throw new ValidationError(1);

        let user = await this.userRepository.get(id, ['avatar', 'role']);
        return user && new UserView(user);
    }

    async getUserByToken(token: string): Promise<IUser | undefined> {
        if (!token)
            throw new ValidationError(1);

        let param = {
            query: {
                'token.accessToken': token,
                'token.tokenExpire': {
                    $gt: new Date()
                },
                'deletedAt': {$exists: false}
            },
            populate: ['avatar', 'role']
        };
        return await this.userRepository.findOne(param);
    }

    async getProfile(id: string): Promise<UserProfile | undefined> {
        if (!validator.isMongoId(id))
            throw new ValidationError(1);

        let user = await this.userRepository.get(id, ['avatar']);
        return user && new UserProfile(user);
    }

    async authenticate(email: string, password: string): Promise<UserAuthentication> {
        if (!validator.isEmail(email) || !password)
            throw new ValidationError(1);

        let param = {
            query: {
                email: email.trim().toLowerCase(),
                password: this.hashPassword(password),
                deletedAt: {$exists: false}
            },
            populate: ['avatar', 'role']
        };

        let user = await this.userRepository.findOne(param);
        if (!user)
            throw new ValidationError(103, 'email address or password');

        if (!user.token || user.token.provider !== LoginProvider.System || !user.token.accessToken || !user.token.tokenExpire || user.token.tokenExpire.getTime() < Date.now())
            user.token = await this.updateUserToken(user.id, new UserToken({provider: LoginProvider.System} as any));

        return new UserAuthentication(user);
    }

    private validate(user: IUser) {
        if (!user.firstName)
            throw new ValidationError(101, 'first name');
        if (user.firstName.length > 20)
            throw new ValidationError(202, 'first name', 20);

        if (!user.lastName)
            throw new ValidationError(101, 'last name');
        if (user.lastName.length > 20)
            throw new ValidationError(202, 'last name', 20);

        if (!user.fullName)
            throw new ValidationError(101, 'full name');
        if (user.fullName.length > 50)
            throw new ValidationError(202, 'full name', 50);

        if (!user.email)
            throw new ValidationError(101, 'email address');
        if (!validator.isEmail(user.email))
            throw new ValidationError(102, 'email address');

        if (!user.password)
            throw new ValidationError(101, 'password');

        if (user.gender && user.gender !== GenderType.Female && user.gender !== GenderType.Male)
            throw new ValidationError(102, 'gender');

        if (user.birthday && !validator.isDate(user.birthday))
            throw new ValidationError(102, 'birthday');

        if (user.phone && !validator.isMobilePhone(user.phone, 'any'))
            throw new ValidationError(102, 'phone');

        if (user.address && user.address.length > 200)
            throw new ValidationError(202, 'address', 200);

        if (user.culture && user.culture.length !== 5)
            throw new ValidationError(102, 'culture');

        if (!user.role)
            throw new ValidationError(101, 'role');
    }

    private validatePassword(password: string) {
        if (!password)
            throw new ValidationError(101, 'password');
        if (password.length < 6 || password.length > 20)
            throw new ValidationError(301, 'password', 6, 20);

        // let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
        // if (!regExp.test(password))
        //     throw new ValidationError(302, 'password', 6, 20, 'with one uppercase letter, one lower case letter, one digit and one special character');
    }

    private hashPassword(password: string): string {
        return password ? crypto.createHash('md5').update('$$' + password).digest('hex') : '';
    }

    async signup(data: any): Promise<UserAuthentication | undefined> {
        if (!data)
            throw new ValidationError(1);

        let role = await this.roleBusiness.getRoleByCode(RoleCode.UserCommon);
        if (!role)
            throw new ValidationError(104, 'role');

        data.role = role.id;
        let user = await this.create(data);
        if (user)
            user.token = await this.updateUserToken(user.id, new UserToken({provider: LoginProvider.System} as any));

        return user && new UserAuthentication(user);
    }

    private async create(data: any): Promise<IUser | undefined> {
        if (!data)
            throw new ValidationError(1);

        let user: any = DataHelper.filterDataInput({}, data, [
            'firstName',
            'lastName',
            'email',
            'password',
            'gender',
            'birthday',
            'phone',
            'address',
            'culture',
            'currency',
            'role'
        ]);
        user.fullName = user.firstName + ' ' + user.lastName;
        user.email = user.email && user.email.trim().toLowerCase();
        this.validatePassword(user.password);
        user.password = this.hashPassword(user.password);

        this.validate(user);

        if (await this.userRepository.findOne({query: {email: user.email}}))
            throw new ValidationError(105, 'email');

        if (!validator.isMongoId(user.role))
            throw new ValidationError(101, 'role');

        return await this.userRepository.create(user);
    }

    async update(id: string, data: any): Promise<boolean> {
        if (!validator.isMongoId(id) || !data)
            throw new ValidationError(1);

        let user = await this.userRepository.get(id);
        if (!user)
            throw new ValidationError(104, 'user');

        DataHelper.filterDataInput(user, data, [
            'firstName',
            'lastName',
            'gender',
            'birthday',
            'phone',
            'address',
            'culture',
            'currency'
        ]);

        let fullName = user.firstName + ' ' + user.lastName;
        if (user.fullName !== fullName)
            user.fullName = fullName;
        this.validate(user);

        await this.userRepository.update(id, user);
        await Authenticator.deleteUserCaching(id);
        return true;
    }

    async updatePassword(id: string, password: string, newPassword: string): Promise<boolean> {
        if (!validator.isMongoId(id) || !password || !newPassword)
            throw new ValidationError(1);

        this.validatePassword(newPassword);
        let param = {
            query: {
                _id: id,
                password: this.hashPassword(password),
                deletedAt: {$exists: false}
            }
        };
        let user = await this.userRepository.findOne(param);
        if (!user)
            throw new ValidationError(104, 'user');

        await this.userRepository.update(id, {password: this.hashPassword(newPassword)});
        await Authenticator.deleteUserCaching(id);
        return true;
    }

    private async updateUserToken(id: string, token: UserToken): Promise<UserToken> {
        if (!validator.isMongoId(id) || !token)
            throw new ValidationError(1);

        let user = await this.userRepository.get(id);
        if (!user)
            throw new ValidationError(104, 'user');

        token.accessToken = crypto.randomBytes(64).toString('hex').substr(0, 64);
        token.tokenExpire = DateHelper.addDays(new Date(), config.EXPIRE_DAYS);

        await this.userRepository.update(id, {token: token});
        return token;
    }

    async delete(id: string): Promise<boolean> {
        if (!validator.isMongoId(id))
            throw new ValidationError(1);

        let user = await this.userRepository.get(id);
        if (!user)
            throw new ValidationError(104, 'user');

        await this.userRepository.delete(id);
        await Authenticator.deleteUserCaching(id);
        return true;
    }

    async initialUsers(data: {isRequired: boolean, data: any}[], isRequired = false): Promise<boolean> {
        if (!data || !Array.isArray(data))
            throw new ValidationError(1);
        let roles = await this.roleBusiness.getAll();

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.isRequired || isRequired) {
                let role = roles.find(role => role.code === item.data.roleCode);
                if (role)
                    item.data.role = role.id;

                await this.create(item.data).catch(error => {
                    console.log(`User '${item.data.email}' cannot create with error`, error); // eslint-disable-line
                });
            }
        }
        return true;
    }
}
