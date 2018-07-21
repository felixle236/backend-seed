import 'mocha';
import {expect} from 'chai';
import {Container} from 'typedi';
import MongoAccess from '../../application/dataAccess/MongoAccess';
import IRoleBusiness from '../../application/businesses/interfaces/IRoleBusiness'; // eslint-disable-line
import RoleBusiness from '../../application/businesses/RoleBusiness';
import IPermissionBusiness from '../../application/businesses/interfaces/IPermissionBusiness'; // eslint-disable-line
import PermissionBusiness from '../../application/businesses/PermissionBusiness';
import RoleClaim from '../../resources/permissions/RoleClaim';
import getRoles from '../../resources/initialization/Roles';
import getPermissions from '../../resources/initialization/Permissions';
let roleBusiness: IRoleBusiness = Container.get(RoleBusiness);
let permissionBusiness: IPermissionBusiness = Container.get(PermissionBusiness);

describe('Permission business testing', () => {
    before(async () => {
        let roles = getRoles();
        await roleBusiness.initialRoles(roles, true);
    });

    after(async () => {
        await MongoAccess.connection.db.dropCollection('permissions');
        await MongoAccess.connection.db.dropCollection('roles');
    });

    it('Initial permissions with data input invalid', () => {
        permissionBusiness.initialPermissions(undefined as any, true).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Initial permissions', async () => {
        let initPermissions = getPermissions();
        let result = await permissionBusiness.initialPermissions(initPermissions, true);
        expect(result).to.eq(true);
    });

    it('Get all permissions', async () => {
        let permissions = await permissionBusiness.getAll();
        expect(Array.isArray(permissions)).to.eq(true);
    });

    it('Check permission already existed', async () => {
        let permissions = await permissionBusiness.getAll();
        if (permissions.length) {
            let permission = permissions[0];
            let result = await permissionBusiness.checkPermission(permission.role.toString(), permission.claim);
            expect(result).to.eq(true);
        }
    });

    it('Check permission is not exists', async () => {
        let permissions = await permissionBusiness.getAll();
        if (permissions.length) {
            let permission = permissions[0];
            let result = await permissionBusiness.checkPermission(permission.role.toString(), permission.claim * 10);
            expect(result).to.eq(false);
        }
    });

    it('Create new permission with invalid data', async () => {
        await permissionBusiness.create(undefined).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new permission without role', async () => {
        let permissionCreate = {
            claim: 100000
        };
        await permissionBusiness.create(permissionCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new permission without claim', async () => {
        let roles = await roleBusiness.getAll();
        if (roles.length) {
            let permissionCreate = {
                role: roles[0].id
            };
            await permissionBusiness.create(permissionCreate).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Create new permission', async () => {
        let roles = await roleBusiness.getAll();
        if (roles.length) {
            let permissionCreate = {
                role: roles[0].id,
                claim: RoleClaim.CREATE * 10
            };
            let permission = await permissionBusiness.create(permissionCreate);
            expect(!!permission).to.eq(true);
        }
    });

    it('Create new permission with duplicate', async () => {
        let roles = await roleBusiness.getAll();
        if (roles.length) {
            let permissionCreate = {
                role: roles[0].id,
                claim: RoleClaim.CREATE
            };
            await permissionBusiness.create(permissionCreate).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });
});
