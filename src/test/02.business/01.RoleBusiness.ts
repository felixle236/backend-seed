import 'mocha';
import {expect} from 'chai';
import {Container} from 'typedi';
import IRoleBusiness from '../../application/businesses/interfaces/IRoleBusiness'; // eslint-disable-line
import RoleBusiness from '../../application/businesses/RoleBusiness';
import getRoles from '../../resources/initialization/Roles';
let roleBusiness: IRoleBusiness = Container.get(RoleBusiness);

describe('Role business testing', () => {
    it('Initial roles with data input invalid', () => {
        roleBusiness.initialRoles(undefined as any, true).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Initial roles', async () => {
        let initRoles = getRoles();
        let result = await roleBusiness.initialRoles(initRoles, true);
        expect(result).to.eq(true);
    });

    it('Get all roles', async () => {
        let roles = await roleBusiness.getAll();
        expect(Array.isArray(roles)).to.eq(true);
    });

    it('Find roles without param', async () => {
        let data = await roleBusiness.find();
        expect(data && Array.isArray(data.results) && data.pagination && data.pagination.total === data.results.length).to.eq(true);
    });

    it('Find roles with name', async () => {
        let data = await roleBusiness.find('test', 1, 1);
        expect(data && Array.isArray(data.results) && data.pagination && data.pagination.total === data.results.length).to.eq(true);
    });

    it('Get role by invalid id', async () => {
        await roleBusiness.get('').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Get role by id', async () => {
        let role;
        let roles = await roleBusiness.getAll();
        if (roles.length)
            role = await roleBusiness.get(roles[0].id);
        expect(!!role).to.eq(true);
    });

    it('Get role by invalid code', async () => {
        await roleBusiness.getRoleByCode(0).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Get role by code', async () => {
        let role;
        let roles = await roleBusiness.getAll();
        if (roles.length)
            role = await roleBusiness.getRoleByCode(roles[0].code);
        expect(!!role).to.eq(true);
    });

    it('Create new role with invalid data', async () => {
        await roleBusiness.create(undefined).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new role without name', async () => {
        let roleCreate = {
            code: 1,
            name: '',
            level: 1
        };
        await roleBusiness.create(roleCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new role with length name invalid', async () => {
        let roleCreate = {
            code: 1,
            name: 'This is the name with length greater than 30 characters!',
            level: 1
        };
        await roleBusiness.create(roleCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new role', async () => {
        let roleCreate = {
            code: 10,
            name: 'Role test',
            level: 10
        };
        let role = await roleBusiness.create(roleCreate);
        expect(!!role).to.eq(true);
    });

    it('Create new role with duplicate code', async () => {
        let roleCreate = {
            code: 10,
            name: 'Role test',
            level: 10
        };
        await roleBusiness.create(roleCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new role with duplicate name', async () => {
        let roleCreate = {
            code: 11,
            name: 'Role test',
            level: 11
        };
        await roleBusiness.create(roleCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Update role with invalid id', async () => {
        await roleBusiness.update('', undefined).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Update role with invalid data', async () => {
        let roles = await roleBusiness.getAll();
        if (roles.length) {
            await roleBusiness.update(roles[0].id, undefined).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update role without name', async () => {
        let roles = await roleBusiness.getAll();
        if (roles.length) {
            let roleUpdate = roles[0];
            roleUpdate.name = '';

            await roleBusiness.update(roleUpdate.id, roleUpdate).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update role with length name invalid', async () => {
        let roles = await roleBusiness.getAll();
        if (roles.length) {
            let roleUpdate = roles[0];
            roleUpdate.name = 'This is the name with length greater than 30 characters!';

            await roleBusiness.update(roleUpdate.id, roleUpdate).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update role with duplicate name', async () => {
        let roleCreate = {
            code: 12,
            name: 'Role test 2',
            level: 12
        };
        let role = await roleBusiness.create(roleCreate);
        if (role) {
            role.name = 'Role test';
            await roleBusiness.update(role.id, role).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update role', async () => {
        let result;
        let roles = await roleBusiness.getAll();
        if (roles.length < 1) {
            let roleUpdate = roles[0];
            roleUpdate.name = 'Role test updated';
            result = await roleBusiness.update(roleUpdate.id, roleUpdate);
            expect(!!result).to.eq(true);
        }
    });

    it('Delete role with invalid id', async () => {
        await roleBusiness.delete('').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Delete role', async () => {
        let result;
        let roles = await roleBusiness.getAll();
        if (roles.length)
            result = await roleBusiness.delete(roles[0].id);
        expect(result).to.eq(true);
    });

    it('Initial roles with data input invalid', async () => {
        await roleBusiness.initialRoles(null as any, true).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });
});
