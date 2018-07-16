import {Service} from 'typedi'; // eslint-disable-line
import BaseRepository from './base/BaseRepository';
import RoleSchema from '../schemas/RoleSchema';
import IRole from '../models/role/interfaces/IRole'; // eslint-disable-line

@Service()
export default class RoleRepository extends BaseRepository<IRole> {
    public constructor() {
        super(RoleSchema);
    }
}
