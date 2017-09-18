import Role from '../app/model/role/Role';
import RoleBusiness from '../app/business/RoleBusiness';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';

class DataLoader {
    private static roleBusiness: IRoleBusiness = new RoleBusiness();

    static roles: Role[] = [];

    static async loadAll(): Promise<void> {
        await DataLoader.loadRoles();

        if (process.env.NODE_ENV == 'development')
            console.log('Global Data ===> Done.');
    }

    static async loadRoles(): Promise<void> {
        DataLoader.roles = await DataLoader.roleBusiness.getAll();

        if (process.env.NODE_ENV == 'development')
            console.log('The roles data loading has finished.');
    }
}

Object.seal(DataLoader);
export default DataLoader;
