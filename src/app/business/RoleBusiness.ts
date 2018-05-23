import IRoleBusiness from './interfaces/IRoleBusiness'; // eslint-disable-line
import RoleRepository from '../repository/RoleRepository';
import Role from '../model/role/Role';
import RoleCreate from '../model/role/RoleCreate';
import RoleUpdate from '../model/role/RoleUpdate';
import CachingHelper from '../../helpers/CachingHelper';
import {ErrorCommon} from '../model/common/Error';

class RoleBusiness implements IRoleBusiness {
    private static _instance: IRoleBusiness;
    private roleRepository: RoleRepository;

    private constructor() {
        this.roleRepository = new RoleRepository();
    }

    static get instance() {
        if (!RoleBusiness._instance)
            RoleBusiness._instance = new RoleBusiness();
        return RoleBusiness._instance;
    }

    async getAll(): Promise<Role[]> {
        let param = {
            query: {
                deletedAt: {$exists: false}
            }
        };
        let roles = await this.roleRepository.findAll(param, {level: 1});
        return Role.parseArray(roles);
    }

    async getList(name?: string, page?: number, limit?: number): Promise<Role[]> {
        let param = {
            query: <any>{
                deletedAt: {$exists: false}
            }
        };
        if (name)
            param.query.name = new RegExp(name, 'i');

        let roles = await this.roleRepository.find(param, {level: 1}, page, limit);
        return Role.parseArray(roles);
    }

    async count(name?: string): Promise<number> {
        let param = {
            query: <any>{
                deletedAt: {$exists: false}
            }
        };
        if (name)
            param.query.name = new RegExp(name, 'i');

        return await this.roleRepository.count(param);
    }

    async get(_id: string): Promise<Role | undefined> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');

        let role = await this.roleRepository.get(_id);
        return role && new Role(role);
    }

    async getRoleByCode(code: number): Promise<Role | undefined> {
        if (!code)
            throw new ErrorCommon(105, 'Code');

        let param = {
            query: {
                code,
                deletedAt: {$exists: false}
            }
        };

        let role = await this.roleRepository.findOne(param);
        return role && new Role(role);
    }

    async getRoleByName(name: string): Promise<Role | undefined> {
        if (!name)
            throw new ErrorCommon(105, 'Name');

        let param = {
            query: {
                name: name.trim(),
                deletedAt: {$exists: false}
            }
        };

        let role = await this.roleRepository.findOne(param);
        return role && new Role(role);
    }

    async create(data: any): Promise<Role | undefined> {
        if (!data)
            throw new ErrorCommon(101, 'Data');

        let role;
        let dataCreate = new RoleCreate(data);

        if (validateName(dataCreate.name)) {
            role = await this.roleRepository.findOne({
                query: {
                    code: dataCreate.code
                }
            });
            if (role)
                throw new ErrorCommon(104, 'Code');

            role = await this.roleRepository.findOne({
                query: {
                    name: dataCreate.name.trim()
                }
            });
            if (role)
                throw new ErrorCommon(104, 'Name');

            role = await this.roleRepository.create(dataCreate);
            // Load data roles in caching
            await CachingHelper.post('/fetch-data-role');
        }

        return role && new Role(role);
    }

    async update(_id: string, data: any): Promise<boolean> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');
        if (!data)
            throw new ErrorCommon(101, 'Data');

        let role;
        let dataUpdate = new RoleUpdate(data);

        if (validateName(dataUpdate.name)) {
            role = await this.roleRepository.findOne({
                query: {
                    name: dataUpdate.name.trim()
                }
            });
            if (role && role._id !== _id)
                throw new ErrorCommon(104, 'Name');

            role = await this.roleRepository.findOneAndUpdate({_id}, dataUpdate);
            // Load data roles in caching
            await CachingHelper.post('/fetch-data-role');
        }
        return true;
    }

    async updateClaims(_id: string, claims: string[]): Promise<boolean> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');
        if (!claims)
            throw new ErrorCommon(105, 'Claims');

        await this.roleRepository.update(_id, {claims});
        // Load data roles in caching
        await CachingHelper.post('/fetch-data-role');
        return true;
    }

    async delete(_id: string): Promise<boolean> {
        if (!_id)
            throw new ErrorCommon(105, 'Id');

        await this.roleRepository.delete(_id);
        // Load data roles in caching
        await CachingHelper.post('/fetch-data-role');
        return true;
    }

    async initialRoles(data: {isRequired: boolean, data: any}[], isRequired = false): Promise<boolean> {
        if (!data || !Array.isArray(data))
            throw new ErrorCommon(101, 'Data');

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.isRequired || isRequired) {
                await this.create(item.data).then(role => {
                    if (role)
                        console.log(`Role '${item.data.name}' has created.`);
                }).catch(error => {
                    if (error.code && !error.code.toString().startsWith('COM'))
                        console.log(`Role '${item.data.name}' cannot create with error`, error);
                });
            }
        }
        console.log('\x1b[32m', 'Initialize roles have done.', '\x1b[0m');
        return true;
    }

    async initialRoleClaims(data: {isRequired: boolean, data: any}[], isRequired = false): Promise<boolean> {
        if (!data || !Array.isArray(data))
            throw new ErrorCommon(101, 'Data');

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.isRequired || isRequired) {
                let role = await this.getRoleByCode(item.data.roleCode);
                if (role) {
                    let isUpdated = false;
                    if (!role.claims)
                        role.claims = [];

                    item.data.claims.forEach(claim => {
                        if (role && !role.claims.includes(claim)) {
                            isUpdated = true;
                            role.claims.push(claim);
                        }
                    });

                    if (isUpdated) {
                        await this.updateClaims(role._id, role.claims).catch(error => {
                            console.log(`Role claims of '${role!.name}' cannot update with error`, error);
                        });
                        console.log(`Role claims of '${role.name}' has updated.`);
                    }
                }
            }
        }
        console.log('\x1b[32m', 'Initialize role claims have done.', '\x1b[0m');
        return true;
    }
}

function validateName(name: string): boolean {
    if (!name)
        throw new ErrorCommon(105, 'Name');
    else if (name.trim().length < 4)
        throw new ErrorCommon(201, 'Name', 4);

    return true;
}

export default RoleBusiness;
