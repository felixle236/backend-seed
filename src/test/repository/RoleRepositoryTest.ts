import 'mocha';
import {expect} from 'chai';
import Project from '../../config/Project';
import DataAccess from '../../app/dataAccess/DataAccess';
import RoleRepository from '../../app/repository/RoleRepository';
import IRole from '../../app/model/role/interfaces/IRole';
import Role from '../../app/model/role/Role'; // eslint-disable-line
import RoleCreate from '../../app/model/role/RoleCreate';
import RoleUpdate from '../../app/model/role/RoleUpdate';

let connection;
const roleRepository = new RoleRepository();

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

describe('Role repository testing', () => {
    it('Create new role', async () => {
        let roleCreate = new RoleCreate(<IRole>{
            name: 'Role test',
            order: 1
        });
        let role = await roleRepository.create(roleCreate);
        expect(role.name).to.equal(roleCreate.name);
    });

    it('Update role', async () => {
        let role = await roleRepository.findOne();
        if (role) {
            let roleUpdate = new RoleUpdate(role);
            roleUpdate.name = 'Role updated';
            let result = await roleRepository.update(role._id, roleUpdate);
            expect(result).to.be.true;
        }
    });

    it('Update role claims', async () => {
        let role = await roleRepository.findOne();
        if (role) {
            let result = await roleRepository.updateClaims(role._id, ['Claim 1', 'Claim 2']);
            expect(result).to.be.true;
        }
    });
});
