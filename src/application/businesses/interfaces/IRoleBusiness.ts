import RoleView from '../../models/role/RoleView';
import RoleLookup from '../../models/role/RoleLookup';
import ResultList from '../../models/common/ResultList';

interface IRoleBusiness {
    getAll(): Promise<RoleView[]>;
    find(keyword?: string, page?: number, limit?: number): Promise<ResultList<RoleView>>;
    lookup(keyword?: string, page?: number, limit?: number): Promise<ResultList<RoleLookup>>;
    get(id: string): Promise<RoleView | undefined>;
    getRoleByCode(code: number): Promise<RoleView | undefined>;
    create(data: any): Promise<RoleView | undefined>;
    update(id: string, data: any): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    initialRoles(data: {isRequired: boolean, data: any}[], isRequired: boolean): Promise<boolean>;
}

export default IRoleBusiness;
