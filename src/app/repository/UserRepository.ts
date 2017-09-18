import IUser from '../model/user/interfaces/IUser'; // eslint-disable-line
import UserSchema from '../dataAccess/schemas/UserSchema';
import BaseRepository from './base/BaseRepository';
import UserCreate from '../model/user/UserCreate'; // eslint-disable-line
import UserUpdate from '../model/user/UserUpdate'; // eslint-disable-line
import UserToken from '../model/user/UserToken'; // eslint-disable-line

class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserSchema);
    }

    async getUserLogin(email: string, password: string): Promise<IUser | null> {
        return await super.findOne({email: email, password: password});
    }

    async getByToken(token: string): Promise<IUser | null> {
        return await super.findOne({'token.accessToken': token, 'token.tokenExpire': {$gt: new Date()}});
    }

    async create(data: UserCreate): Promise<IUser> {
        return await super.create(data);
    }

    async update(_id: string, data: UserUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }

    async updateUserToken(_id: string, token: UserToken): Promise<boolean> {
        return await super.update(_id, {token: token});
    }

    async updateRoles(_id: string, roles: string[]): Promise<boolean> {
        return await super.update(_id, {roles: roles});
    }

    async updateClaims(_id: string, claims: string[]): Promise<boolean> {
        return await super.update(_id, {claims: claims});
    }
}

Object.seal(UserRepository);
export default UserRepository;
