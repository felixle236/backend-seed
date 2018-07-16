import {Service} from 'typedi'; // eslint-disable-line
import BaseRepository from './base/BaseRepository';
import UserSchema from '../schemas/UserSchema';
import IUser from '../models/user/interfaces/IUser'; // eslint-disable-line

@Service()
export default class UserRepository extends BaseRepository<IUser> {
    public constructor() {
        super(UserSchema);
    }
}
