import 'mocha';
import {expect} from 'chai';
import {Container} from 'typedi';
import MongoAccess from '../../application/dataAccess/MongoAccess';
import IRoleBusiness from '../../application/businesses/interfaces/IRoleBusiness'; // eslint-disable-line
import RoleBusiness from '../../application/businesses/RoleBusiness';
import getRoles from '../../resources/initialization/Roles';
let roleBusiness: IRoleBusiness = Container.get(RoleBusiness);

describe('Role business testing', () => {
    after(async () => {
        await MongoAccess.connection.db.dropCollection('roles');
    });

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

    it('Lookup roles without param', async () => {
        let data = await roleBusiness.lookup();
        expect(data && Array.isArray(data.results) && data.pagination && data.pagination.total === data.results.length).to.eq(true);
    });

    it('Lookup roles with name', async () => {
        let data = await roleBusiness.lookup('test', 1, 1);
        expect(data && Array.isArray(data.results) && data.pagination && data.pagination.total === data.results.length).to.eq(true);
    });

    it('Get role by id invalid', () => {
        roleBusiness.get('123').catch(error => {
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

    it('Get role by code invalid', () => {
        roleBusiness.getRoleByCode(0).catch(error => {
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

    it('Create new role with data invalid', () => {
        roleBusiness.create(undefined).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new role without name', () => {
        let roleCreate = {
            code: 1,
            name: '',
            level: 1
        };
        roleBusiness.create(roleCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new role with length name invalid', () => {
        let roleCreate = {
            code: 1,
            name: 'This is the name with length greater than 50 characters!',
            level: 1
        };
        roleBusiness.create(roleCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new role successfully', async () => {
        let roleCreate = {
            code: 10,
            name: 'Role test',
            level: 10
        };
        let role = await roleBusiness.create(roleCreate);
        expect(!!role).to.eq(true);
    });

    it('Create new role with code duplication', () => {
        let roleCreate = {
            code: 10,
            name: 'Role test',
            level: 10
        };
        roleBusiness.create(roleCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Create new role with name duplication', () => {
        let roleCreate = {
            code: 11,
            name: 'Role test',
            level: 11
        };
        roleBusiness.create(roleCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Update role with data invalid', async () => {
        let roles = await roleBusiness.getAll();
        if (roles.length) {
            await roleBusiness.update(roles[0].id, undefined).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update role without id', () => {
        roleBusiness.update('', undefined).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Update role with id not exists', async () => {
        let roles = await roleBusiness.getAll();
        if (roles.length) {
            let roleUpdate = roles[0];
            await roleBusiness.update('5b4dbf5b968d3a484eb5810a', roleUpdate).catch(error => {
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
            roleUpdate.name = 'This is the name with length greater than 50 characters!';

            await roleBusiness.update(roleUpdate.id, roleUpdate).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update role with name duplication', async () => {
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

    it('Update role successfully', async () => {
        let result;
        let roles = await roleBusiness.getAll();
        if (roles.length < 1) {
            let roleUpdate = roles[0];
            roleUpdate.name = 'Role test updated';
            result = await roleBusiness.update(roleUpdate.id, roleUpdate);
            expect(!!result).to.eq(true);
        }
    });

    it('Delete role without id', () => {
        roleBusiness.delete('').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Delete role with id not exists', () => {
        roleBusiness.delete('5b4dbf5b968d3a484eb5810a').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Delete role successfully', async () => {
        let result;
        let roles = await roleBusiness.getAll();
        if (roles.length)
            result = await roleBusiness.delete(roles[0].id);
        expect(result).to.eq(true);
    });
});
