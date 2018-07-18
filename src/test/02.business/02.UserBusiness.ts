import 'mocha';
import {expect} from 'chai';
import {Container} from 'typedi';
import IUserBusiness from '../../application/businesses/interfaces/IUserBusiness'; // eslint-disable-line
import UserBusiness from '../../application/businesses/UserBusiness';
import getUsers from '../../resources/initialization/Users';
let userBusiness: IUserBusiness = Container.get(UserBusiness);

describe('User business testing', () => {
    it('Initial users with data input invalid', () => {
        userBusiness.initialUsers(null as any, true).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Initial users', async () => {
        let initUsers = getUsers();
        let result = await userBusiness.initialUsers(initUsers, true);
        expect(result).to.eq(true);
    });

    it('Find users without param', async () => {
        let data = await userBusiness.find('', 1, 1000);
        expect(data && Array.isArray(data.results) && data.pagination && data.pagination.total === data.results.length).to.eq(true);
    });

    it('Find users with name or mail', async () => {
        let data = await userBusiness.find('felix', 1, 1000);
        expect(data && Array.isArray(data.results) && data.pagination && data.pagination.total === data.results.length).to.eq(true);
    });

    it('Get user by invalid id', () => {
        userBusiness.get('123').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Get user by id', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            let user = await userBusiness.get(data.results[0].id);
            expect(!!user).to.eq(true);
        }
    });

    it('Get user profile by invalid id', () => {
        userBusiness.getProfile('123').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Get user profile by id', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            let userProfile = await userBusiness.getProfile(data.results[0].id);
            expect(!!userProfile).to.eq(true);
        }
    });

    it('Get user by invalid token', async () => {
        await userBusiness.getUserByToken('').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Get user by token', async () => {
        let userAuth1;
        let userAuth2 = await userBusiness.authenticate('admin@localhost.com', '123456');
        if (userAuth2 && userAuth2.token)
            userAuth1 = await userBusiness.getUserByToken(userAuth2.token.accessToken);
        expect(!!userAuth1).to.eq(true);
    });

    it('Signin without email', () => {
        userBusiness.authenticate('', '123456').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Signin with invalid email', () => {
        userBusiness.authenticate('admin@', '123456').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Signin without password', () => {
        userBusiness.authenticate('admin@localhost.com', '').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Signin with wrong email or password', () => {
        userBusiness.authenticate('admin@localhost.com', '123abc').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Signin successfully', async () => {
        let userAuth = await userBusiness.authenticate('admin@localhost.com', '123456');
        expect(!!userAuth).to.eq(true);
    });

    it('Signup with invalid data', () => {
        userBusiness.signup(undefined).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Signup successfully', async () => {
        let userCreate = {
            firstName: 'Felix',
            lastName: 'Le',
            email: 'felix.le.236@gmail.com',
            password: '123456'
        };
        let user = await userBusiness.signup(userCreate);
        expect(!!user).to.eq(true);
    });

    it('Signup user with duplicate email', () => {
        let userCreate = {
            firstName: 'Admin',
            lastName: 'Localhost',
            email: 'admin@localhost.com',
            password: '123456'
        };
        userBusiness.signup(userCreate).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Update user with invalid id', () => {
        userBusiness.update('', undefined).catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Update user with invalid data', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            await userBusiness.update(data.results[0].id, undefined).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update user without first name', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            let user = data.results[0];
            delete user.firstName;
            await userBusiness.update(user.id, user).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update user with length first name invalid', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            let user = data.results[0];
            user.firstName = 'This is the length greater than 30 characters!';
            await userBusiness.update(user.id, user).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update user without last name', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            let user = data.results[0];
            delete user.lastName;
            await userBusiness.update(user.id, user).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update user with length last name invalid', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            let user = data.results[0];
            user.lastName = 'This is the length greater than 30 characters!';
            await userBusiness.update(user.id, user).catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update user successfully', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            let user = data.results[0];
            user.lastName = 'Test 123';
            let result = await userBusiness.update(user.id, user);
            if (result) {
                let userUpdated = await userBusiness.get(user.id);
                expect(userUpdated && userUpdated.lastName === user.lastName).to.eq(true);
            }
        }
    });

    it('Update password with data invalid', async () => {
        await userBusiness.updatePassword('', '', '').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Update password with authenticate invalid', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            let user = data.results[0];
            await userBusiness.updatePassword(user.id, '12345', '123456').catch(error => {
                expect(error.httpCode).to.eq(400);
            });
        }
    });

    it('Update password successfully', async () => {
        let data = await userBusiness.find('', 1, 1);
        if (data && data.results && data.results.length) {
            let user = data.results[0];
            let result = await userBusiness.updatePassword(user.id, '123456', '123456');
            expect(result).to.eq(true);
        }
    });

    it('Delete user with invalid id', () => {
        userBusiness.delete('').catch(error => {
            expect(error.httpCode).to.eq(400);
        });
    });

    it('Delete user', async () => {
        let userAuth = await userBusiness.authenticate('felix.le.236@gmail.com', '123456');
        if (userAuth) {
            let result = await userBusiness.delete(userAuth.id);
            expect(result).to.eq(true);
        }
    });
});
