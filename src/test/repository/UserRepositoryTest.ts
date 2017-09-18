import 'mocha';
import {expect} from 'chai';
import * as crypto from 'crypto';
import Project from '../../config/Project';
import DataAccess from '../../app/dataAccess/DataAccess';
import UserRepository from '../../app/repository/UserRepository';
import IUser from '../../app/model/user/interfaces/IUser';
import User from '../../app/model/user/User'; // eslint-disable-line
import UserCreate from '../../app/model/user/UserCreate';
import UserUpdate from '../../app/model/user/UserUpdate';
import UserToken from '../../app/model/user/UserToken';
import LoginProvider from '../../app/model/user/enums/LoginProvider';
import DateHelper from '../../helpers/DateHelper';

let connection;
const userRepository = new UserRepository();

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

function createAccessToken() {
    return crypto.randomBytes(64).toString('hex').substr(0, 128);
}

describe('User repository testing', () => {
    it('Create new user', async () => {
        let userCreate = new UserCreate(<IUser>{
            name: 'User test',
            email: 'test@gmail.com',
            password: '123456'
        });
        let user = await userRepository.create(userCreate);
        expect(user.name).to.equal(userCreate.name);
    });

    it('Update user', async () => {
        let user = await userRepository.findOne();
        if (user) {
            let userUpdate = new UserUpdate(user);
            userUpdate.name = 'User updated';
            let result = await userRepository.update(user._id, userUpdate);
            expect(result).to.be.true;
        }
    });

    it('Update user token', async () => {
        let user = await userRepository.findOne();
        if (user) {
            let userToken = new UserToken(LoginProvider.Local);
            userToken.accessToken = createAccessToken();
            userToken.tokenExpire = DateHelper.addDays(new Date(), Project.EXPIRE_DAYS);
            let result = await userRepository.updateUserToken(user._id, userToken);
            expect(result).to.be.true;
        }
    });

    it('Update user roles', async () => {
        let user = await userRepository.findOne();
        if (user) {
            let result = await userRepository.updateRoles(user._id, ['597ef0012199231dc95f94a0', '597ef0012199231dc95f94a1']);
            expect(result).to.be.true;
        }
    });

    it('Update user claims', async () => {
        let user = await userRepository.findOne();
        if (user) {
            let result = await userRepository.updateClaims(user._id, ['Claim 1', 'Claim 2']);
            expect(result).to.be.true;
        }
    });

    it('Get user login', async () => {
        let user = await userRepository.getUserLogin('test@gmail.com', '123456');
        expect(user).to.not.be.null;
    });

    it('Get user by token', async () => {
        let user = await userRepository.findOne();
        if (user && user.token) {
            user = await userRepository.getByToken(user.token.accessToken);
            expect(user).to.not.be.null;
        }
    });
});
