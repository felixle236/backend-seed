import {Container, Service, Inject} from 'typedi'; // eslint-disable-line
import {Validator} from 'class-validator';
import IPermissionBusiness from './interfaces/IPermissionBusiness'; // eslint-disable-line
import IRoleBusiness from './interfaces/IRoleBusiness';
import RoleBusiness from './RoleBusiness';
import PermissionRepository from '../repositories/PermissionRepository';
import IPermission from '../models/permission/interfaces/IPermission'; // eslint-disable-line
import PermissionView from '../models/permission/PermissionView';
import {ValidationError} from '../models/common/Error';
import CachingHelper from '../../helpers/CachingHelper';
import DataHelper from '../../helpers/DataHelper';
const validator = Container.get(Validator);

@Service()
export default class PermissionBusiness implements IPermissionBusiness {
    @Inject()
    private permissionRepository: PermissionRepository;
    @Inject(() => RoleBusiness)
    private roleBusiness: IRoleBusiness;

    public async getAll(): Promise<PermissionView[]> {
        let permissions = await this.permissionRepository.findAll();
        return PermissionView.parseArray(permissions);
    }

    public async checkPermission(role: string, claim: number): Promise<boolean> {
        if (!validator.isMongoId(role) || !claim || !validator.isNumber(claim))
            throw new ValidationError(1);

        let param = {
            query: {
                role: DataHelper.toObjectId(role),
                claim
            }
        };
        let permission = await this.permissionRepository.findOne(param);
        return !!permission;
    }

    private validate(permission: IPermission): void {
        if (!permission.role)
            throw new ValidationError(101, 'role');

        if (!permission.claim)
            throw new ValidationError(101, 'claim');
        if (!validator.isNumber(permission.claim) || permission.claim < 1)
            throw new ValidationError(102, 'claim');
    }

    public async create(data: any): Promise<PermissionView | undefined> {
        if (!data)
            throw new ValidationError(1);

        let permission: any = DataHelper.filterDataInput({}, data, [
            'role',
            'claim'
        ]);
        this.validate(permission);

        let param = {
            query: {
                role: permission.role,
                claim: permission.claim
            }
        };

        if (await this.permissionRepository.findOne(param))
            throw new ValidationError(105, 'permission');

        permission = await this.permissionRepository.create(permission);
        return permission && new PermissionView(permission);
    }

    public async initialPermissions(data: {isRequired: boolean, data: any}[], isRequired = false): Promise<boolean> {
        if (!data || !Array.isArray(data))
            throw new ValidationError(1);
        let roles = await this.roleBusiness.getAll();

        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.isRequired || isRequired) {
                let role = roles.find(role => role.code === item.data.roleCode);
                if (role) {
                    item.data.role = role.id;
                    await this.create(item.data).catch(error => {
                        console.log(`Permission '${role!.name} - ${item.data.claim}' cannot create with error`, error); // eslint-disable-line
                    });
                }
            }
        }
        await CachingHelper.post('/fetch-permission');
        return true;
    }
}
