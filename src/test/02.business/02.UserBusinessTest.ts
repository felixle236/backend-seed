import 'mocha';
import {expect} from 'chai';
import BusinessLoader from '../../system/BusinessLoader';
import IRoleBusiness from '../../app/business/interfaces/IRoleBusiness'; // eslint-disable-line
import IUserBusiness from '../../app/business/interfaces/IUserBusiness'; // eslint-disable-line
import IUser from '../../app/model/user/interfaces/IUser';
import getUsers from '../../resources/initialData/Users';
import getUserRoles from '../../resources/initialData/UserRoles';

let roleBusiness: IRoleBusiness;
let userBusiness: IUserBusiness;

before(done => {
    roleBusiness = BusinessLoader.roleBusiness;
    userBusiness = BusinessLoader.userBusiness;
    done();
});

describe('User business testing', () => {
    it('Create new user with invalid data', async () => {
        await userBusiness.create(<any>undefined).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Create new user without first name', async () => {
        let userCreate = <IUser>{};
        await userBusiness.create(userCreate).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Create new user with length first name invalid', async () => {
        let userCreate = <IUser>{
            firstName: 'F'
        };
        await userBusiness.create(userCreate).catch(error => {
            expect(error.code).to.eq('COM201');
        });
    });

    it('Create new user without last name', async () => {
        let userCreate = <IUser>{
            firstName: 'Felix'
        };
        await userBusiness.create(userCreate).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Create new user with length last name invalid', async () => {
        let userCreate = <IUser>{
            firstName: 'Felix',
            lastName: 'L'
        };
        await userBusiness.create(userCreate).catch(error => {
            expect(error.code).to.eq('COM201');
        });
    });

    it('Create new user without email', async () => {
        let userCreate = <IUser>{
            firstName: 'Felix',
            lastName: 'Le'
        };
        await userBusiness.create(userCreate).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Create new user with email invalid', async () => {
        let userCreate = <IUser>{
            firstName: 'Felix',
            lastName: 'Le',
            email: 'felix.le.236'
        };
        await userBusiness.create(userCreate).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Create new user without password', async () => {
        let userCreate = <IUser>{
            firstName: 'Felix',
            lastName: 'Le',
            email: 'felix.le.236@gmail.com'
        };
        await userBusiness.create(userCreate).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Create new user with password invalid', async () => {
        let userCreate = <IUser>{
            firstName: 'Felix',
            lastName: 'Le',
            email: 'felix.le.236@gmail.com',
            password: '12345'
        };
        await userBusiness.create(userCreate).catch(error => {
            expect(error.code).to.eq('COM201');
        });
    });

    it('Create new user', async function() {
        this.timeout(6000); // eslint-disable-line
        let userCreate = <IUser>{
            firstName: 'Felix',
            lastName: 'Le',
            email: 'felix.le.236@gmail.com',
            password: '123456'
        };
        let user = await userBusiness.create(userCreate);
        expect(user).to.not.be.undefined;
    });

    it('Signup with invalid data', async () => {
        await userBusiness.signup(<any>undefined).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Signup', async function() {
        this.timeout(6000); // eslint-disable-line
        let userCreate = <IUser>{
            firstName: 'Felix',
            lastName: 'Le 2',
            email: 'felix.le.236@localhost.com',
            password: '123456'
        };
        let user = await userBusiness.signup(userCreate);
        expect(user).to.not.be.undefined;
    });

    it('Validate email with fake email', async function() {
        this.timeout(6000); // eslint-disable-line
        await userBusiness.validateEmail('felix.le.236@gmail123.com').catch(error => {
            expect(error.code).to.eq('COM108');
        });
    });

    it('Create new user with duplicate email', async () => {
        let userCreate = <IUser>{
            firstName: 'Felix',
            lastName: 'Le',
            email: 'felix.le.236@gmail.com'
        };
        await userBusiness.create(userCreate).catch(error => {
            expect(error.code).to.eq('COM104');
        });
    });

    it('Update user with invalid id', async () => {
        await userBusiness.update('', <any>undefined).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update user with invalid data', async () => {
        let users = await userBusiness.getList('', 1, 1);
        if (users.length < 1)
            return expect(0).to.not.eq(0);

        await userBusiness.update(users[0]._id, <any>undefined).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Update user without first name', async () => {
        let users = await userBusiness.getList('', 1, 1);
        if (users.length < 1)
            return expect(0).to.not.eq(0);

        let userUpdate = <IUser>{};
        await userBusiness.update(users[0]._id, userUpdate).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update user with length first name invalid', async () => {
        let users = await userBusiness.getList('', 1, 1);
        if (users.length < 1)
            return expect(0).to.not.eq(0);

        let userUpdate = <IUser>{
            firstName: 'F'
        };
        await userBusiness.update(users[0]._id, userUpdate).catch(error => {
            expect(error.code).to.eq('COM201');
        });
    });

    it('Update user without last name', async () => {
        let users = await userBusiness.getList('', 1, 1);
        if (users.length < 1)
            return expect(0).to.not.eq(0);

        let userUpdate = <IUser>{
            firstName: 'Felix'
        };
        await userBusiness.update(users[0]._id, userUpdate).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update user with length last name invalid', async () => {
        let users = await userBusiness.getList('', 1, 1);
        if (users.length < 1)
            return expect(0).to.not.eq(0);

        let userUpdate = <IUser>{
            firstName: 'Felix',
            lastName: 'L'
        };
        await userBusiness.update(users[0]._id, userUpdate).catch(error => {
            expect(error.code).to.eq('COM201');
        });
    });

    it('Update user', async () => {
        let result;
        let user = await userBusiness.getUserByEmail('felix.le.236@localhost.com');
        if (user) {
            user.lastName = 'Test';
            result = await userBusiness.update(user._id, user);
        }
        expect(result).to.be.true;
    });

    it('Update user role with invalid id', async () => {
        await userBusiness.updateRole('', <any>undefined).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update user role with invalid data', async () => {
        let users = await userBusiness.getList('', 1, 1);
        if (users.length < 1)
            return expect(0).to.not.eq(0);

        await userBusiness.updateRole(users[0]._id, <any>undefined).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Update user role', async () => {
        let result;
        let user = await userBusiness.getUserByEmail('felix.le.236@gmail.com');
        if (user) {
            let roles = await roleBusiness.getList('', 1, 1);
            if (!roles.length)
                return expect(0).to.not.eq(0);
            result = await userBusiness.updateRole(user._id, roles[0]._id);
        }
        expect(result).to.be.true;
    });

    it('Update user claims with invalid id', async () => {
        await userBusiness.updateClaims('', <any>undefined).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update user claims with invalid data', async () => {
        let users = await userBusiness.getList('', 1, 1);
        if (users.length < 1)
            return expect(0).to.not.eq(0);

        await userBusiness.updateClaims(users[0]._id, <any>undefined).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Update user claims', async () => {
        let result;
        let user = await userBusiness.getUserByEmail('felix.le.236@gmail.com');
        if (user)
            result = await userBusiness.updateClaims(user._id, ['Claim 1', 'Claim 2']);
        expect(result).to.be.true;
    });

    it('Search users without param', async () => {
        let users = await userBusiness.getList('', 1, 1);
        expect(Array.isArray(users)).to.be.true;
    });

    it('Search users with name', async () => {
        let users = await userBusiness.getList('felix', 1, 1);
        expect(Array.isArray(users)).to.be.true;
    });

    it('Count users without param', async () => {
        let count = await userBusiness.count();
        expect(!isNaN(count)).to.be.true;
    });

    it('Count users with name', async () => {
        let count = await userBusiness.count('felix');
        expect(!isNaN(count)).to.be.true;
    });

    it('Get user by invalid id', async () => {
        let users = await userBusiness.getList('', 1, 1);
        if (users.length < 1)
            return expect(0).to.not.eq(0);

        await userBusiness.get(users[0]._id).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Get user by id', async () => {
        let users = await userBusiness.getList('', 1, 1);
        if (users.length < 1)
            return expect(0).to.not.eq(0);

        let user = await userBusiness.get(users[0]._id);
        expect(user).to.not.be.undefined;
    });

    it('Get user by invalid email', async () => {
        await userBusiness.getUserByEmail('').catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Get user by email', async () => {
        let user = await userBusiness.getUserByEmail('felix.le.236@gmail.com');
        expect(user).to.not.be.undefined;
    });

    it('Get user permission by invalid id', async () => {
        await userBusiness.getPermission('').catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Get user permission by id', async () => {
        let userPermission;
        let users = await userBusiness.getList('', 1, 1);
        if (users.length)
            userPermission = await userBusiness.getPermission(users[0]._id);
        expect(userPermission).to.not.be.undefined;
    });

    it('Signin without email', async () => {
        await userBusiness.authenticate('', '123456').catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Signin with invalid email', async () => {
        await userBusiness.authenticate('felix.le.236', '123456').catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Signin without password', async () => {
        await userBusiness.authenticate('felix.le.236@gmail.com', '').catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Signin with wrong email or password', async () => {
        await userBusiness.authenticate('felix.le.236@gmail.com', '123abc').catch(error => {
            expect(error.code).to.eq('COM108');
        });
    });

    it('Signin', async () => {
        let userAuth = await userBusiness.authenticate('felix.le.236@gmail.com', '123456');
        expect(userAuth).to.not.be.undefined;
    });

    it('Get user by invalid token', async () => {
        await userBusiness.getUserByToken('').catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Get user by token', async () => {
        let userAuth1;
        let userAuth2 = await userBusiness.authenticate('felix.le.236@gmail.com', '123456');
        if (userAuth2 && userAuth2.token)
            userAuth1 = await userBusiness.getUserByToken(userAuth2.token.accessToken);
        expect(userAuth1).to.not.be.undefined;
    });

    it('Delete user with invalid id', async () => {
        await userBusiness.delete(<any>undefined).catch(error => {
            expect(error.code).to.eq('COM105');
        });
    });

    it('Delete user', async () => {
        let result;
        let user = await userBusiness.getUserByEmail('felix.le.236@localhost.com');
        if (user)
            result = await userBusiness.delete(user._id);
        expect(result).to.be.true;
    });

    it('Initial users with data input invalid', async () => {
        await userBusiness.initialUsers(<any>null, true).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Initial users', async () => {
        let initUsers = getUsers();
        let result = await userBusiness.initialUsers(initUsers, true);
        expect(result).to.be.true;
    });

    it('Initial user roles with data input invalid', async () => {
        await userBusiness.initialUserRoles(<any>null, true).catch(error => {
            expect(error.code).to.eq('COM101');
        });
    });

    it('Initial user roles', async () => {
        let initUserRoles = getUserRoles();
        let result = await userBusiness.initialUserRoles(initUserRoles, true);
        expect(result).to.be.true;
    });
});