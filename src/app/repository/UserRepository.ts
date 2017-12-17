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

    async authenticate(email: string, password: string): Promise<IUser | null> {
        let param = {
            query: {
                email: email,
                password: password
            }
        };
        return await super.findOne(param);
    }

    async getByToken(token: string): Promise<IUser | null> {
        let param = {
            query: {
                'token.accessToken': token,
                'token.tokenExpire': {
                    $gt: new Date()
                }
            }
        };
        return await super.findOne(param);
    }

    async getByEmail(email): Promise<IUser | null> {
        let param = {
            query: {
                email: email
            }
        };
        return await super.findOne(param);
    }

    async checkEmailExists(email: string): Promise<boolean> {
        let param = {
            query: {
                email: email,
                $or: [
                    {deletedAt: {$exists: true}},
                    {deletedAt: null}
                ]
            }
        };
        let user = await this.model.findOne(param);
        if (user)
            return true;
        return false;
    }

    async create(data: UserCreate): Promise<IUser> {
        return await super.create(data);
    }

    async update(_id: string, data: UserUpdate): Promise<IUser> {
        return await super.update(_id, data);
    }

    async updateUserToken(_id: string, token: UserToken): Promise<IUser> {
        return await super.update(_id, {token: token});
    }

    async updateRoles(_id: string, roles: string[]): Promise<IUser> {
        return await super.update(_id, {roles: roles});
    }

    async updateClaims(_id: string, claims: string[]): Promise<IUser> {
        return await super.update(_id, {claims: claims});
    }
}

Object.seal(UserRepository);
export default UserRepository;
