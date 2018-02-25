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

    async getRoles(name?: string, page?: number, limit?: number): Promise<Role[]> {
        let param = {
            query: <any>{}
        };
        if (name)
            param.query.name = new RegExp(name, 'i');

        let roles = await this.roleRepository.find(param, {name: 1}, page, limit);
        return Role.parseArray(roles);
    }

    async countRoles(name?: string): Promise<number> {
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

    async getRoleByName(name: string): Promise<Role | null> {
        if (!name)
            return null;

        let role = await this.roleRepository.findOne({query: {name: name.trim()}});
        return role && new Role(role);
    }

    async create(data: any): Promise<Role> {
        let role;
        let dataCreate = new RoleCreate(data);

        if (validateName(dataCreate.name)) {
            role = await this.getRoleByName(dataCreate.name);
            if (role)
                throw new ErrorCommon(104, 'Name');

            role = await this.roleRepository.create(dataCreate);
            // Load data roles in memory
            DataLoader.loadRoles();
        }

        return role && new Role(role);
    }

    async update(_id: string, data: any): Promise<Role | null> {
        let role;
        let dataUpdate = new RoleUpdate(data);

        if (validateName(dataUpdate.name)) {
            role = await this.getRoleByName(dataUpdate.name);
            if (role && role._id === _id)
                throw new ErrorCommon(104, 'Name');

            role = await this.roleRepository.findOneAndUpdate({_id}, dataUpdate);

            // Load data roles in memory
            if (role)
                DataLoader.loadRoles();
        }
        return role && new Role(role);
    }

    async updateClaims(_id: string, claims: string[]): Promise<boolean> {
        let result = await this.roleRepository.update(_id, {claims});

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
