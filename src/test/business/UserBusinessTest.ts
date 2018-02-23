import 'mocha';
import {expect} from 'chai';
import Project from '../../config/Project';
import BusinessLoader from '../../system/BusinessLoader';
import DataAccess from '../../app/dataAccess/DataAccess';
import IUserBusiness from '../../app/business/interfaces/IUserBusiness'; // eslint-disable-line
import IUser from '../../app/model/user/interfaces/IUser';
import User from '../../app/model/user/User'; // eslint-disable-line
import UserCreate from '../../app/model/user/UserCreate';
import UserUpdate from '../../app/model/user/UserUpdate';
import UserAuthentication from '../../app/model/user/UserAuthentication'; // eslint-disable-line

BusinessLoader.init();
let connection;
let userBusiness: IUserBusiness = BusinessLoader.userBusiness;

before(done => {
    connection = DataAccess.connect(Project.DB_CONN_URI_TEST);
    connection.once('open', async () => {
        await connection.db.dropDatabase();
        done();
    });
});

after(async () => {
    await connection.db.dropDatabase();
});

describe('User business testing', () => {
    it('Create new user', async function(this: any) {
        this.timeout(6000); // eslint-disable-line
        let userCreate = new UserCreate(<IUser>{
            name: 'Felix Le',
            email: 'felix.le.236@gmail.com',
            password: '123456'
        });
        let user = await userBusiness.create(userCreate);
        expect(user.name).to.equal(userCreate.name);
    });

    it('Find users', async () => {
        let users = await userBusiness.getUsers('', 1, 1);
        expect(Array.isArray(users)).to.be.true;
    });

    it('Get user by email', async () => {
        let user = await userBusiness.getUserByEmail('felix.le.236@gmail.com');
        expect(user).to.not.be.null;
    });

    it('Get user by id', async () => {
        let user = await userBusiness.getUserByEmail('felix.le.236@gmail.com');
        if (user) {
            user = await userBusiness.get(user._id);
            expect(user).to.not.be.null;
        }
    });

    it('Update user', async () => {
        let user = await userBusiness.getUserByEmail('felix.le.236@gmail.com');
        if (user) {
            let userUpdate = new UserUpdate(<IUser>user);
            userUpdate.name = 'User updated';
            user = await userBusiness.update(user._id, userUpdate);
            expect(user).to.not.be.null;
        }
    });

    it('Delete user', async () => {
        let user = await userBusiness.getUserByEmail('felix.le.236@gmail.com');
        if (user) {
            let result = await userBusiness.delete(user._id);
            expect(result).to.be.true;
        }
    });

    it('Create user login', async function(this: any) {
        this.timeout(6000); // eslint-disable-line
        let userCreate = new UserCreate(<IUser>{
            name: 'Felix Le',
            email: 'felix.le.236@gmail.com',
            password: '123456'
        });
        let userAuth = await userBusiness.signup(userCreate);
        expect(userAuth.profile.name).to.equal(userCreate.name);
    });

    it('Update user roles', async () => {
        let users = await userBusiness.getUsers('', 1, 1);
        if (users && users.length > 0) {
            let user = users[0];
            let result = await userBusiness.updateRoles(user._id, ['697ef0012199231dc95f94a0', '797ef0012199231dc95f94a1']);
            expect(result).to.be.true;
        }
    });

    it('Update user claims', async () => {
        let users = await userBusiness.getUsers('', 1, 1);
        if (users && users.length > 0) {
            let user = users[0];
            let result = await userBusiness.updateClaims(user._id, ['Claim 1', 'Claim 2']);
            expect(result).to.be.true;
        }
    });

    it('Get user login', async () => {
        let userAuth = await userBusiness.authenticate('felix.le.236@gmail.com', '123456');
        expect(userAuth).to.not.be.null;
    });

    it('Get user by token', async () => {
        let userAuth = await userBusiness.authenticate('felix.le.236@gmail.com', '123456');
        if (userAuth && userAuth.token) {
            userAuth = await userBusiness.getUserByToken(userAuth.token.accessToken);
            expect(userAuth).to.not.be.null;
        }
    });

    it('Get user permission', async () => {
        let users = await userBusiness.getUsers('', 1, 1);
        if (users && users.length > 0) {
            let userPermission = await userBusiness.getPermission(users[0]._id);
            expect(userPermission).to.not.be.null;
        }
    });
});
