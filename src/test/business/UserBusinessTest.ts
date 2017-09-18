import 'mocha';
import {expect} from 'chai';
import Project from '../../config/Project';
import DataAccess from '../../app/dataAccess/DataAccess';
import IUserBusiness from '../../app/business/interfaces/IUserBusiness'; // eslint-disable-line
import UserBusiness from '../../app/business/UserBusiness';
import IUser from '../../app/model/user/interfaces/IUser';
import User from '../../app/model/user/User'; // eslint-disable-line
import UserCreate from '../../app/model/user/UserCreate';
import UserUpdate from '../../app/model/user/UserUpdate';
import UserLogin from '../../app/model/user/UserLogin'; // eslint-disable-line

let connection;
let userBusiness: IUserBusiness = new UserBusiness();

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

describe('User business testing', () => {
    it('Create new user', async () => {
        let userCreate = new UserCreate(<IUser>{
            name: 'User test',
            email: 'test@gmail.com',
            password: '123456'
        });
        let user = await userBusiness.create(userCreate);
        expect(user.name).to.equal(userCreate.name);
    });

    it('Create user login', async () => {
        let userCreate = new UserCreate(<IUser>{
            name: 'User test 2',
            email: 'test2@gmail.com',
            password: '123456'
        });
        let userLogin = await userBusiness.createUserLogin(userCreate);
        expect(userLogin.user.name).to.equal(userCreate.name);
    });

    it('Update user', async () => {
        let users = await userBusiness.getList(1, 1);
        if (users && users.length > 0) {
            let userUpdate = new UserUpdate(<IUser>users[0]);
            userUpdate.name = 'User updated';
            let user = await userBusiness.update(users[0]._id, userUpdate);
            expect(user).to.not.be.null;
        }
    });

    it('Update user roles', async () => {
        let users = await userBusiness.getList(1, 1);
        if (users && users.length > 0) {
            let user = users[0];
            let result = await userBusiness.updateRoles(user._id, ['697ef0012199231dc95f94a0', '797ef0012199231dc95f94a1']);
            expect(result).to.be.true;
        }
    });

    it('Update user claims', async () => {
        let users = await userBusiness.getList(1, 1);
        if (users && users.length > 0) {
            let user = users[0];
            let result = await userBusiness.updateClaims(user._id, ['Claim 1', 'Claim 2']);
            expect(result).to.be.true;
        }
    });

    it('Find users', async () => {
        let users = await userBusiness.getList(1, 1);
        expect(Array.isArray(users)).to.be.true;
    });

    it('Get user by id', async () => {
        let users = await userBusiness.getList(1, 1);
        if (users && users.length > 0) {
            let user = await userBusiness.get(users[0]._id);
            expect(user).to.not.be.null;
        }
    });

    it('Get user login', async () => {
        let userLogin = await userBusiness.getUserLogin('test@gmail.com', '123456');
        expect(userLogin).to.not.be.null;
    });

    it('Get user login by token', async () => {
        let userLogin = await userBusiness.getUserLogin('test@gmail.com', '123456');
        if (userLogin) {
            userLogin = await userBusiness.getUserLoginByToken(userLogin.accessToken);
            expect(userLogin).to.not.be.null;
        }
    });

    it('Get user by email', async () => {
        let user = await userBusiness.getByEmail('test@gmail.com');
        expect(user).to.not.be.null;
    });

    it('Get user permission', async () => {
        let users = await userBusiness.getList(1, 1);
        if (users && users.length > 0) {
            let userPermission = await userBusiness.getPermission(users[0]._id);
            expect(userPermission).to.not.be.null;
        }
    });

    it('Delete user', async () => {
        let users = await userBusiness.getList(1, 1);
        if (users && users.length > 0) {
            let result = await userBusiness.delete(users[0]._id);
            expect(result).to.be.true;
        }
    });
});
