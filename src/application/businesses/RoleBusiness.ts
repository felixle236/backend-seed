import {Container, Service, Inject} from 'typedi'; // eslint-disable-line
import {Validator} from 'class-validator';
import IRoleBusiness from './interfaces/IRoleBusiness'; // eslint-disable-line
import RoleRepository from '../repositories/RoleRepository';
import IRole from '../models/role/interfaces/IRole'; // eslint-disable-line
import RoleView from '../models/role/RoleView';
import RoleLookup from '../models/role/RoleLookup';
import {ValidationError} from '../models/common/Error';
import ResultList from '../models/common/ResultList';
import DataHelper from '../../helpers/DataHelper';
const validator = Container.get(Validator);

@Service()
export default class RoleBusiness implements IRoleBusiness {
    @Inject()
    private roleRepository: RoleRepository;

    async getAll(): Promise<RoleView[]> {
        let roles = await this.roleRepository.findAll();
        return RoleView.parseArray(roles);
    }

    async find(keyword?: string, page?: number, limit?: number): Promise<ResultList<RoleView>> {
        let resultList = new ResultList<RoleView>(page, limit);
        let param = {
            query: {
                deletedAt: {$exists: false}
            },
            order: {
                level: 1,
                name: 1
            },
            page,
            limit
        };

        if (keyword)
            (param.query as any).name = new RegExp(keyword.trim(), 'i');

        let roles = await this.roleRepository.find(param);
        resultList.results = RoleView.parseArray(roles);
        resultList.pagination.total = await this.roleRepository.count(param);
        return resultList;
    }

    async lookup(keyword?: string, page?: number, limit?: number): Promise<ResultList<RoleLookup>> {
        let resultList = new ResultList<RoleLookup>(page, limit);
        let param = {
            query: {
                deletedAt: {$exists: false}
            },
            order: {
                level: 1,
                name: 1
            },
            page,
            limit
        };

        if (keyword)
            (param.query as any).name = new RegExp(keyword.trim(), 'i');

        let roles = await this.roleRepository.find(param);
        resultList.results = RoleLookup.parseArray(roles);
        resultList.pagination.total = await this.roleRepository.count(param);
        return resultList;
    }

    async get(id: string): Promise<RoleView | undefined> {
        if (!validator.isMongoId(id))
            throw new ValidationError(1);

        let role = await this.roleRepository.get(id);
        return role && new RoleView(role);
    }

    async getRoleByCode(code: number): Promise<RoleView | undefined> {
        if (!code)
            throw new ValidationError(1);

        let param = {
            query: {
                code,
                deletedAt: {$exists: false}
            }
        };

        let role = await this.roleRepository.findOne(param);
        return role && new RoleView(role);
    }

    private validate(role: IRole) {
        if (!role)
            throw new ValidationError(1);

        if (!role.code)
            throw new ValidationError(101, 'code');
        if (!validator.isNumber(role.code) || role.code < 1 || role.code > 100)
            throw new ValidationError(102, 'code');

        if (!role.name)
            throw new ValidationError(101, 'name');
        if (role.name.length > 30)
            throw new ValidationError(202, 'name', 30);

        if (!role.level)
            throw new ValidationError(101, 'level');
        if (!validator.isNumber(role.level) || role.level < 1 || role.level > 100)
            throw new ValidationError(102, 'level');
    }

    async create(data: any): Promise<RoleView | undefined> {
        if (!data)
            throw new ValidationError(1);

        let role: any = DataHelper.filterDataInput({}, data, [
            'code',
            'name',
            'level'
        ]);
        this.validate(role);

        if (await this.roleRepository.findOne({query: {code: role.code}}))
            throw new ValidationError(105, 'code');

        let param = {
            query: {
                name: new RegExp(`^${role.name}$`, 'i'),
                deletedAt: {$exists: false}
            }
        };

        if (await this.roleRepository.findOne(param))
            throw new ValidationError(105, 'name');

        role = await this.roleRepository.create(role);
        return role && new RoleView(role);
    }

    async update(id: string, data: any): Promise<boolean> {
        if (!validator.isMongoId(id) || !data)
            throw new ValidationError(1);

        let role = await this.roleRepository.get(id);
        if (!role)
            throw new ValidationError(104, 'role');

        DataHelper.filterDataInput(role, data, [
            'name',
            'level'
        ]);
        this.validate(role);

        let param = {
            query: {
                _id: {$ne: DataHelper.toObjectId(role.id)},
                name: new RegExp(`^${role.name}$`, 'i'),
                deletedAt: {$exists: false}
            }
        };
        if (await this.roleRepository.findOne(param))
            throw new ValidationError(105, 'name');

        await this.roleRepository.update(id, role);
        return true;
    }

    async delete(id: string): Promise<boolean> {
        if (!validator.isMongoId(id))
            throw new ValidationError(1);

        let role = await this.roleRepository.get(id);
        if (!role)
            throw new ValidationError(104, 'role');

        await this.roleRepository.delete(id);
        return true;
    }

    async initialRoles(data: {isRequired: boolean, data: any}[], isRequired = false): Promise<boolean> {
        if (!data || !Array.isArray(data))
            throw new ValidationError(1);

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.isRequired || isRequired) {
                await this.create(item.data).catch(error => {
                    console.log(`Role '${item.data.name}' cannot create with error`, error); // eslint-disable-line
                });
            }
        }
        return true;
    }
}
