import {sealed} from '../../helpers/InjectionHelper'; // eslint-disable-line
import IRole from '../model/role/interfaces/IRole'; // eslint-disable-line
import RoleSchema from '../dataAccess/schemas/RoleSchema';
import BaseRepository from './base/BaseRepository';
import RoleCreate from '../model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from '../model/role/RoleUpdate'; // eslint-disable-line

@sealed
class RoleRepository extends BaseRepository<IRole> {
    constructor() {
        super(RoleSchema);
    }

    async create(data: RoleCreate): Promise<IRole> {
        return await super.create(data);
    }

    async update(_id: string, data: RoleUpdate): Promise<boolean> {
        return await super.update(_id, data);
    }

    async updateClaims(_id: string, claims: string[]): Promise<boolean> {
        return await super.update(_id, {claims: claims});
    }
}

export default RoleRepository;
