import BaseRepository from 'multi-layer-pattern/repository/base/BaseRepository';
import IUser from '../model/user/interfaces/IUser'; // eslint-disable-line
import UserSchema from '../dataAccess/schemas/UserSchema';

class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserSchema);
    }
}

Object.seal(UserRepository);
export default UserRepository;
