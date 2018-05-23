import 'mocha';
import {expect} from 'chai';
import CachingBusiness from '../../app/business/CachingBusiness';
import RoleBusiness from '../../app/business/RoleBusiness';
import UserBusiness from '../../app/business/UserBusiness';
import ICachingBusiness from '../../app/business/interfaces/ICachingBusiness'; // eslint-disable-line
import IUserBusiness from '../../app/business/interfaces/IUserBusiness'; // eslint-disable-line
import IRoleBusiness from '../../app/business/interfaces/IRoleBusiness'; // eslint-disable-line

before(done => {
    done();
});

describe('Caching business testing', () => {
    it('Fetch data role', async () => {
        let result = await CachingBusiness.instance.fetchDataRole();
        expect(result).to.be.true;
    });

    it('Get roles caching', async () => {
        let roles = await CachingBusiness.instance.getRoles();
        expect(Array.isArray(roles)).to.be.true;
    });

    it('Get role caching by invalid id', async () => {
        let role = await CachingBusiness.instance.getRole('');
        expect(role).to.be.undefined;
    });

    it('Get role caching by id', async () => {
        let role;
        let roles = await CachingBusiness.instance.getRoles();
        if (roles.length)
            role = await CachingBusiness.instance.getRole(roles[0]._id);
        expect(role).to.not.be.undefined;
    });

    it('Get role caching by list id', async () => {
        let result;
        let roles = await CachingBusiness.instance.getRoles();
        if (roles.length)
            result = await CachingBusiness.instance.getRolesByIds(roles.map(role => role._id));
        expect(Array.isArray(result)).to.be.true;
    });

    it('Get role caching by invalid code', async () => {
        let role = await CachingBusiness.instance.getRoleByCode(0);
        expect(role).to.be.undefined;
    });

    it('Get role caching by code', async () => {
        let role;
        let roles = await CachingBusiness.instance.getRoles();
        if (roles.length)
            role = await CachingBusiness.instance.getRoleByCode(roles[0].code);
        expect(role).to.not.be.undefined;
    });

    it('Get user authenticated caching by invalid token', async () => {
        let userAuth = await CachingBusiness.instance.getUserAuthenticationByToken('');
        expect(userAuth).to.be.undefined;
    });

    it('Get user authenticated caching by token', async () => {
        let userAuth1;
        let userAuth2 = await UserBusiness.instance.authenticate('felix.le.236@gmail.com', '123456');
        if (userAuth2 && userAuth2.token)
            userAuth1 = await CachingBusiness.instance.getUserAuthenticationByToken(userAuth2.token.accessToken);
        expect(userAuth1).to.not.be.undefined;
    });

    it('Delete role caching', async () => {
        let result;
        let roles = await CachingBusiness.instance.getRoles();
        if (roles.length)
            result = await CachingBusiness.instance.deleteRole(roles[0]._id);
        expect(result).to.be.true;
    });

    it('Delete all roles caching', async () => {
        let result = await CachingBusiness.instance.deleteRoles();
        expect(result).to.be.true;
    });

    it('Create role caching by invalid data', async () => {
        let result = await CachingBusiness.instance.createRole(<any>undefined);
        expect(result).to.be.false;
    });

    it('Create role caching', async () => {
        let result;
        let roles = await RoleBusiness.instance.getAll();
        if (roles.length)
            result = await CachingBusiness.instance.createRole(roles[0]);
        expect(result).to.be.true;
    });

    it('Delete user authenticated caching by invalid id', async () => {
        let result = await CachingBusiness.instance.deleteUserAuthentication('');
        expect(result).to.be.false;
    });

    it('Delete user authenticated caching', async () => {
        let result;
        let userAuth = await UserBusiness.instance.authenticate('felix.le.236@gmail.com', '123456');
        if (userAuth)
            result = await CachingBusiness.instance.deleteUserAuthentication(userAuth._id);
        expect(result).to.be.true;
    });

    it('Create user authenticated caching by invalid data', async () => {
        let result = await CachingBusiness.instance.createUserAuthentication(<any>undefined);
        expect(result).to.be.false;
    });

    it('Create user authenticated caching', async () => {
        let userAuth = await UserBusiness.instance.authenticate('felix.le.236@gmail.com', '123456');
        let result = await CachingBusiness.instance.createUserAuthentication(userAuth);
        expect(result).to.be.true;
    });
});
