import IUser from '../model/user/interfaces/IUser'; // eslint-disable-line
import UserSchema from '../dataAccess/schemas/UserSchema';
import BaseRepository from './base/BaseRepository';

class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserSchema);
    }
}

Object.seal(UserRepository);
export default UserRepository;
