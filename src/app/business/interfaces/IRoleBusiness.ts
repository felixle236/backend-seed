import IBaseBusiness from './base/IBaseBusiness';
import Role from '../../model/role/Role';
import RoleCreate from '../../model/role/RoleCreate'; // eslint-disable-line
import RoleUpdate from '../../model/role/RoleUpdate'; // eslint-disable-line

interface IRoleBusiness extends IBaseBusiness<Role> {
    getAll: () => Promise<Role[]>;
    getRoles: (name?: string, page?: number, limit?: number) => Promise<Role[]>;
    countRoles: (name?: string) => Promise<number>;
    getRoleByName: (name: string) => Promise<Role | null>;
    updateClaims: (_id: string, claims: string[]) => Promise<boolean>;
}

export default IRoleBusiness;
