import {injectable} from '../../helpers/InjectionHelper'; // eslint-disable-line
import Role from '../model/role/Role';
import RoleCreate from '../model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from '../model/role/RoleUpdate'; // eslint-disable-line
import IRoleBusiness from './interfaces/IRoleBusiness'; // eslint-disable-line
import RoleRepository from '../repository/RoleRepository';
import DataLoader from '../../system/DataLoader';
import {ErrorCommon} from '../model/common/Error';

@injectable
class RoleBusiness implements IRoleBusiness {
    private roleRepository: RoleRepository;

    constructor() {
        this.roleRepository = new RoleRepository();
    }

    async getAll(): Promise<Role[]> {
        let roles = await this.roleRepository.findAll();
        return Role.parseArray(roles);
    }

    async getList(page: number, limit: number): Promise<Role[]> {
        let roles = await this.roleRepository.find(null, null, page, limit);
        return Role.parseArray(roles);
    }

    async getCount(): Promise<number> {
        return await this.roleRepository.getCount();
    }

    async get(_id: string): Promise<Role | null> {
        if (!_id)
            return null;

        let role = await this.roleRepository.get(_id);
        return role && new Role(role);
    }

    async getByName(name: string): Promise<Role | null> {
        if (!name)
            return null;

        let role = await this.roleRepository.findOne({query: {name: name.trim()}});
        return role && new Role(role);
    }

    async create(data: RoleCreate): Promise<Role> {
        let role;
        if (validateName(data.name)) {
            role = await this.getByName(data.name);
            if (role)
                throw new ErrorCommon(104, 'Name');

            role = await this.roleRepository.create(data);
            // Load data roles in memory
            DataLoader.loadRoles();
        }

        return role && new Role(role);
    }

    async update(_id: string, data: RoleUpdate): Promise<Role | null> {
        if (validateName(data.name)) {
            let role = await this.getByName(data.name);
            if (role && role._id === _id)
                throw new ErrorCommon(104, 'Name');

            let result = await this.roleRepository.update(_id, data);

            // Load data roles in memory
            if (result)
                DataLoader.loadRoles();
        }
        return await this.get(_id);
    }

    async updateClaims(_id: string, claims: string[]): Promise<boolean> {
        let result = await this.roleRepository.updateClaims(_id, claims);

        // Load data roles in memory
        if (result)
            DataLoader.loadRoles();

        return result;
    }

    async delete(_id: string): Promise<boolean> {
        let result = await this.roleRepository.delete(_id);

        // Load data roles in memory
        if (result)
            DataLoader.loadRoles();

        return result;
    }
}

function validateName(name: string): boolean {
    if (!name)
        throw new ErrorCommon(105, 'Name');
    else if (name.trim().length < 4)
        throw new ErrorCommon(201, 'name', 4);

    return true;
}

Object.seal(RoleBusiness);
export default RoleBusiness;
