import IRole from '../model/role/interfaces/IRole'; // eslint-disable-line
import RoleSchema from '../dataAccess/schemas/RoleSchema';
import BaseRepository from './base/BaseRepository';

class RoleRepository extends BaseRepository<IRole> {
    constructor() {
        super(RoleSchema);
    }
}

Object.seal(RoleRepository);
export default RoleRepository;
