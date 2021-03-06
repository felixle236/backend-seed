import 'mocha';
import {expect} from 'chai';
import {Container} from 'typedi';
import {Validator} from 'class-validator';
import MongoAccess from '../../application/dataAccess/MongoAccess';
import ICachingBusiness from '../../application/businesses/interfaces/ICachingBusiness'; // eslint-disable-line
import CachingBusiness from '../../application/businesses/CachingBusiness';
import IRoleBusiness from '../../application/businesses/interfaces/IRoleBusiness'; // eslint-disable-line
import RoleBusiness from '../../application/businesses/RoleBusiness';
import IPermissionBusiness from '../../application/businesses/interfaces/IPermissionBusiness'; // eslint-disable-line
import PermissionBusiness from '../../application/businesses/PermissionBusiness';
import IUserBusiness from '../../application/businesses/interfaces/IUserBusiness'; // eslint-disable-line
import UserBusiness from '../../application/businesses/UserBusiness';
import RoleClaim from '../../resources/permissions/RoleClaim';
import {RoleCode} from '../../application/models/common/CommonType';
import getRoles from '../../resources/initialization/Roles';
import getUsers from '../../resources/initialization/Users';
import getPermissions from '../../resources/initialization/Permissions';
let cachingBusiness: ICachingBusiness = Container.get(CachingBusiness);
let roleBusiness: IRoleBusiness = Container.get(RoleBusiness);
let userBusiness: IUserBusiness = Container.get(UserBusiness);
let permissionBusiness: IPermissionBusiness = Container.get(PermissionBusiness);
const validator = Container.get(Validator);

describe('Caching business testing', () => {
    before(async () => {
        let roles = getRoles();
        let users = getUsers();
        let permissions = getPermissions();
        await roleBusiness.initialRoles(roles, true);
        await userBusiness.initialUsers(users, true);
        await permissionBusiness.initialPermissions(permissions, true);
    });

    after(async () => {
        await MongoAccess.connection.db.dropCollection('permissions');
        await MongoAccess.connection.db.dropCollection('users');
        await MongoAccess.connection.db.dropCollection('roles');
    });

    it('Fetch permissions caching', async () => {
        let result = await cachingBusiness.fetchPermissionCaching();
        expect(validator.isNumber(result)).to.eq(true);
    });

    it('Check permission already existed', async () => {
        let role = await roleBusiness.getRoleByCode(RoleCode.Administrator);
        if (role) {
            let result = await cachingBusiness.checkPermission(role.id, RoleClaim.GET);
            expect(result).to.eq(true);
        }
    });

    it('Check permission is not exists', async () => {
        let role = await roleBusiness.getRoleByCode(RoleCode.Administrator);
        if (role) {
            let result = await cachingBusiness.checkPermission(role.id, RoleClaim.GET * 100);
            expect(result).to.eq(false);
        }
    });

    it('Get user caching by token invalid', () => {
        cachingBusiness.getUserByToken('').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Not found user caching by wrong token', async () => {
        let userCaching = await cachingBusiness.getUserByToken('fake-token');
        expect(!userCaching).to.eq(true);
    });

    it('Get user caching by token', async () => {
        let userAuth = await userBusiness.authenticate('admin@localhost.com', '123456');
        if (userAuth) {
            let user = await userBusiness.getUserByToken(userAuth.token.accessToken);
            if (user) {
                await cachingBusiness.createUser(user);
                let userCaching = await cachingBusiness.getUserByToken(userAuth.token.accessToken);
                expect(!!userCaching).to.eq(true);
            }
        }
    });

    it('Create user caching with data invalid', () => {
        cachingBusiness.createUser(undefined).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create user caching successfully', async () => {
        let userAuth = await userBusiness.authenticate('admin@localhost.com', '123456');
        if (userAuth) {
            let user = await userBusiness.getUserByToken(userAuth.token.accessToken);
            if (user) {
                let result = await cachingBusiness.createUser(user);
                expect(!!result).to.eq(true);
            }
        }
    });

    it('Delete user caching without id', () => {
        cachingBusiness.deleteUser('').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Delete user caching with id not exists', () => {
        cachingBusiness.deleteUser('5b4dbf5b968d3a484eb5810a').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Delete user caching successfully', async () => {
        let userAuth = await userBusiness.authenticate('admin@localhost.com', '123456');
        if (userAuth) {
            let user = await userBusiness.getUserByToken(userAuth.token.accessToken);
            if (user) {
                await cachingBusiness.createUser(user);
                let result = await cachingBusiness.deleteUser(user.id);
                expect(result).to.eq(true);
            }
        }
    });
});
