import BaseRepository from 'multi-layer-pattern/repository/base/BaseRepository';
import IRole from '../model/role/interfaces/IRole'; // eslint-disable-line
import RoleSchema from '../dataAccess/schemas/RoleSchema';

class RoleRepository extends BaseRepository<IRole> {
    constructor() {
        super(RoleSchema);
    }
}

Object.seal(RoleRepository);
export default RoleRepository;
