import Role from '../model/role/Role';
import RoleCreate from '../model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from '../model/role/RoleUpdate'; // eslint-disable-line
import IRoleBusiness from './interfaces/IRoleBusiness'; // eslint-disable-line
import RoleRepository from '../repository/RoleRepository';
import DataLoader from '../../system/DataLoader';
import {ErrorCommon} from '../model/common/Error';

class RoleBusiness implements IRoleBusiness {
    private roleRepository: RoleRepository;

    constructor() {
        this.roleRepository = new RoleRepository();
    }

    async getAll(): Promise<Role[]> {
        let roles = await this.roleRepository.findAll();
        return Role.parseArray(roles);
    }

    async search(name?: string, page?: number, limit?: number): Promise<Role[]> {
        let param = {
            query: <any>{}
        };
        if (name)
            param.query.name = new RegExp(name, 'i');

        let roles = await this.roleRepository.find(param, {name: 1}, page, limit);
        return Role.parseArray(roles);
    }

    async getCountSearch(name?: string): Promise<number> {
        let param = {
            query: <any>{}
        };
        if (name)
            param.query.name = new RegExp(name, 'i');

        return await this.roleRepository.getCount(param);
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
        let result;
        if (validateName(data.name)) {
            let role = await this.getByName(data.name);
            if (role && role._id === _id)
                throw new ErrorCommon(104, 'Name');

            result = await this.roleRepository.findOneAndUpdate({_id}, data);

            // Load data roles in memory
            if (result)
                DataLoader.loadRoles();
        }
        return result && new Role(result);
    }

    async updateClaims(_id: string, claims: string[]): Promise<boolean> {
        let result = await this.roleRepository.updateClaims(_id, claims);

        // Load data roles in memory
        if (result)
            DataLoader.loadRoles();

        return result ? true : false;
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
