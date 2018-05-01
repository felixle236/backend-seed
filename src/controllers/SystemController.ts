import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import getRoles from '../resources/initialData/Roles';
import getRoleClaims from '../resources/initialData/RoleClaims';
import getUsers from '../resources/initialData/Users';
import getUserRoles from '../resources/initialData/UserRoles';
import CachingHelper from '../helpers/CachingHelper';

class SystemController extends BaseController {
    constructor() {
        super();

        this.post('/init-data', this.initData.bind(this));
    }

    async initData(req): Promise<any> {
        let isRequired = process.env.NODE_ENV !== 'Production' && req.body.isRequired === true;

        let initRoles = getRoles();
        let initRoleClaims = getRoleClaims();
        let initUsers = getUsers();
        let initUserRoles = getUserRoles();

        await BusinessLoader.roleBusiness.initialRoles(initRoles, isRequired);
        await BusinessLoader.roleBusiness.initialRoleClaims(initRoleClaims, isRequired);
        // Load data roles in caching
        await CachingHelper.post('/fetch-data-role');

        await BusinessLoader.userBusiness.initialUsers(initUsers, isRequired);
        await BusinessLoader.userBusiness.initialUserRoles(initUserRoles, isRequired);

        return true;
    }
}

Object.seal(SystemController);
export default SystemController;
