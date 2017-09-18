import 'mocha';
import {expect} from 'chai';
import Project from '../../config/Project';
import DataAccess from '../../app/dataAccess/DataAccess';
import IRoleBusiness from '../../app/business/interfaces/IRoleBusiness'; // eslint-disable-line
import RoleBusiness from '../../app/business/RoleBusiness';
import IRole from '../../app/model/role/interfaces/IRole';
import Role from '../../app/model/role/Role'; // eslint-disable-line
import RoleCreate from '../../app/model/role/RoleCreate';
import RoleUpdate from '../../app/model/role/RoleUpdate';

let connection;
let roleBusiness: IRoleBusiness = new RoleBusiness();

before(done => {
    connection = DataAccess.connect(Project.DB_CONN_TEST);
    connection.once('open', async () => {
        await connection.db.dropDatabase();
        done();
    });
});

after(async () => {
    await connection.db.dropDatabase();
});

describe('Role business testing', () => {
    it('Create new role', async () => {
        let roleCreate = new RoleCreate(<IRole>{
            name: 'Role test',
            order: 1
        });
        let role = await roleBusiness.create(roleCreate);
        expect(role.name).to.equal(roleCreate.name);
    });

    it('Update role', async () => {
        let roles = await roleBusiness.getAll();
        if (roles && roles.length > 0) {
            let roleUpdate = new RoleUpdate(<IRole>roles[0]);
            roleUpdate.name = 'Role updated';
            let role = await roleBusiness.update(roles[0]._id, roleUpdate);
            expect(role).to.not.be.null;
        }
    });

    it('Update role claims', async () => {
        let roles = await roleBusiness.getAll();
        if (roles && roles.length > 0) {
            let role = roles[0];
            let result = await roleBusiness.updateClaims(role._id, ['Claim 1', 'Claim 2']);
            expect(result).to.be.true;
        }
    });

    it('Find roles', async () => {
        let roles = await roleBusiness.getAll();
        expect(Array.isArray(roles)).to.be.true;
    });

    it('Get role by id', async () => {
        let roles = await roleBusiness.getAll();
        if (roles && roles.length > 0) {
            let user = await roleBusiness.get(roles[0]._id);
            expect(user).to.not.be.null;
        }
    });

    it('Get role by name', async () => {
        let roles = await roleBusiness.getAll();
        if (roles && roles.length > 0) {
            let user = await roleBusiness.getByName(roles[0].name);
            expect(user).to.not.be.null;
        }
    });

    it('Delete role', async () => {
        let roles = await roleBusiness.getAll();
        if (roles && roles.length > 0) {
            let result = await roleBusiness.delete(roles[0]._id);
            expect(result).to.be.true;
        }
    });
});
