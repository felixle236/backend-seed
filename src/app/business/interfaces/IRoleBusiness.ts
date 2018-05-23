import IBaseBusiness from 'multi-layer-pattern/business/interfaces/base/IBaseBusiness';
import Role from '../../model/role/Role';

interface IRoleBusiness extends IBaseBusiness<Role> {
    getAll(): Promise<Role[]>;
    getList(name?: string, page?: number, limit?: number): Promise<Role[]>;
    count(name?: string): Promise<number>;
    get(_id: string): Promise<Role | undefined>;
    getRoleByCode(code: number): Promise<Role | undefined>;
    getRoleByName(name: string): Promise<Role | undefined>;
    create(data: any): Promise<Role | undefined>;
    updateClaims(_id: string, claims: string[]): Promise<boolean>;
    initialRoles(data: {isRequired: boolean, data: any}[], isRequired: boolean): Promise<boolean>;
    initialRoleClaims(data: {isRequired: boolean, data: any}[], isRequired: boolean): Promise<boolean>;
}

export default IRoleBusiness;
