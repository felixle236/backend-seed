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
}

Object.seal(UserRepository);
export default UserRepository;
