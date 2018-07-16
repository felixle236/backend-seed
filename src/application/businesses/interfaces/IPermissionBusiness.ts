import PermissionView from '../../models/permission/PermissionView';

interface IPermissionBusiness {
    getAll(): Promise<PermissionView[]>;
    checkPermission(role: string, claim: number): Promise<boolean>;
    create(data: any): Promise<PermissionView | undefined>;
    initialPermissions(data: {isRequired: boolean, data: any}[], isRequired: boolean): Promise<boolean>;
}

export default IPermissionBusiness;
