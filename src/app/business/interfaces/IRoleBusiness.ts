import IBaseBusiness from './base/IBaseBusiness';
import Role from '../../model/role/Role';
import RoleCreate from '../../model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from '../../model/role/RoleUpdate'; // eslint-disable-line

interface IRoleBusiness extends IBaseBusiness<Role> {
    getAll: () => Promise<Role[]>;
    getList: (page: number, limit: number) => Promise<Role[]>;
    getCount: () => Promise<number>;
    getByName: (name: string) => Promise<Role | null>;
    create: (data: RoleCreate) => Promise<Role>;
    update: (_id: string, data: RoleUpdate) => Promise<Role | null>;
    updateClaims: (_id: string, claims: string[]) => Promise<boolean>;
}

export default IRoleBusiness;
