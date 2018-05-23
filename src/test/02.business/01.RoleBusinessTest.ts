import 'mocha';
import {expect} from 'chai';
import RoleBusiness from '../../app/business/RoleBusiness';
import IRole from '../../app/model/role/interfaces/IRole';
import getRoles from '../../resources/initialData/Roles';
import getRoleClaims from '../../resources/initialData/RoleClaims';

before(done => {
    done();
});

describe('Role business testing', () => {
    it('Create new role with invalid data', async () => {
        await RoleBusiness.instance.create(<any>undefined).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Create new role without name', async () => {
        let roleCreate = <IRole>{
            code: 1,
            name: '',
            level: 1
        };
        await RoleBusiness.instance.create(roleCreate).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Create new role with length name invalid', async () => {
        let roleCreate = <IRole>{
            code: 1,
            name: 'Abc',
            level: 1
        };
        await RoleBusiness.instance.create(roleCreate).catch(error => {
            expect(error.code).to.eq('COM201');
        });
    });

    it('Create new role', async () => {
        let roleCreate = <IRole>{
            code: 1,
            name: 'Role test',
            level: 1
        };
        let role = await RoleBusiness.instance.create(roleCreate);
        expect(role).to.not.be.undefined;
    });

    it('Create new role with duplicate code', async () => {
        let roleCreate = <IRole>{
            code: 1,
            name: 'Role test',
            level: 1
        };
        await RoleBusiness.instance.create(roleCreate).catch(error => {
            expect(error.code).to.eq('COM104');
        });
    });

    it('Create new role with duplicate name', async () => {
        let roleCreate = <IRole>{
            code: 2,
            name: 'Role test',
            level: 1
        };
        await RoleBusiness.instance.create(roleCreate).catch(error => {
            expect(error.code).to.eq('COM104');
        });
    });

    it('Update role with invalid id', async () => {
        await RoleBusiness.instance.update('', <any>undefined).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update role with invalid data', async () => {
        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length < 1)
            return expect(0).to.not.eq(0);

        await RoleBusiness.instance.update(roles[0]._id, <any>undefined).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Update role without name', async () => {
        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length < 1)
            return expect(0).to.not.eq(0);

        let roleUpdate = <IRole>roles[0];
        roleUpdate.name = '';

        await RoleBusiness.instance.update(roleUpdate._id, roleUpdate).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update role with length name invalid', async () => {
        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length < 1)
            return expect(0).to.not.eq(0);

        let roleUpdate = <IRole>roles[0];
        roleUpdate.name = 'Abc';

        await RoleBusiness.instance.update(roleUpdate._id, roleUpdate).catch(error => {
            expect(error.code).to.eq('COM201');
        });
    });

    it('Update role with duplicate name', async () => {
        let roleCreate = <IRole>{
            code: 2,
            name: 'Role test 2',
            level: 2
        };
        await RoleBusiness.instance.create(roleCreate);

        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length < 1)
            return expect(0).to.not.eq(0);

        let roleUpdate = <IRole>roles[0];
        roleUpdate.name = 'Role test 2';
        await RoleBusiness.instance.update(roleUpdate._id, roleUpdate).catch(error => {
            expect(error.code).to.eq('COM104');
        });
    });

    it('Update role', async () => {
        let result;

        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length < 1)
            return expect(0).to.not.eq(0);

        let roleUpdate = <IRole>roles[0];
        roleUpdate.name = 'Role test updated';
        result = await RoleBusiness.instance.update(roleUpdate._id, roleUpdate);
        expect(result).to.be.true;
    });

    it('Update role claims with invalid id', async () => {
        await RoleBusiness.instance.updateClaims('', <any>undefined).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update role claims with invalid data', async () => {
        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length < 1)
            return expect(0).to.not.eq(0);

        await RoleBusiness.instance.updateClaims(roles[0]._id, <any>undefined).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update role claims', async () => {
        let result;

        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length < 1)
            return expect(0).to.not.eq(0);

        result = await RoleBusiness.instance.updateClaims(roles[0]._id, ['Claim 1', 'Claim 2']);
        expect(result).to.be.true;
    });

    it('Get all roles', async () => {
        let roles = await RoleBusiness.instance.getAll();
        expect(Array.isArray(roles)).to.be.true;
    });

    it('Search roles without param', async () => {
        let roles = await RoleBusiness.instance.getList('', 1, 1);
        expect(Array.isArray(roles)).to.be.true;
    });

    it('Search roles with name', async () => {
        let roles = await RoleBusiness.instance.getList('test', 1, 1);
        expect(Array.isArray(roles)).to.be.true;
    });

    it('Count roles without param', async () => {
        let count = await RoleBusiness.instance.count();
        expect(!isNaN(count)).to.be.true;
    });

    it('Count roles with name', async () => {
        let count = await RoleBusiness.instance.count('test');
        expect(!isNaN(count)).to.be.true;
    });

    it('Get role by invalid id', async () => {
        await RoleBusiness.instance.get('').catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Get role by id', async () => {
        let role;
        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length)
            role = await RoleBusiness.instance.get(roles[0]._id);
        expect(role).to.not.be.undefined;
    });

    it('Get role by invalid code', async () => {
        await RoleBusiness.instance.getRoleByCode(0).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Get role by code', async () => {
        let role;
        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length)
            role = await RoleBusiness.instance.getRoleByCode(roles[0].code);
        expect(role).to.not.be.undefined;
    });

    it('Get role by invalid name', async () => {
        await RoleBusiness.instance.getRoleByName('').catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Get role by name', async () => {
        let role;
        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length)
            role = await RoleBusiness.instance.getRoleByName(roles[0].name);
        expect(role).to.not.be.undefined;
    });

    it('Delete role with invalid id', async () => {
        await RoleBusiness.instance.delete('').catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Delete role', async () => {
        let result;
        let roles = await RoleBusiness.instance.getList('', 1, 1);
        if (roles.length)
            result = await RoleBusiness.instance.delete(roles[0]._id);
        expect(result).to.be.true;
    });

    it('Initial roles with data input invalid', async () => {
        await RoleBusiness.instance.initialRoles(<any>null, true).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Initial roles', async () => {
        let initRoles = getRoles();
        let result = await RoleBusiness.instance.initialRoles(initRoles, true);
        expect(result).to.be.true;
    });

    it('Initial role claims with data input invalid', async () => {
        await RoleBusiness.instance.initialRoleClaims(<any>null, true).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Initial role claims', async () => {
        let initRoleClaims = getRoleClaims();
        let result = await RoleBusiness.instance.initialRoleClaims(initRoleClaims, true);
        expect(result).to.be.true;
    });
});
