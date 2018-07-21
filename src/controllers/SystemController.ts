import {Service, Inject} from 'typedi'; // eslint-disable-line
import {JsonController, Authorized, Body, Post} from 'routing-controllers'; // eslint-disable-line
import IRoleBusiness from '../application/businesses/interfaces/IRoleBusiness';
import RoleBusiness from '../application/businesses/RoleBusiness';
import IUserBusiness from '../application/businesses/interfaces/IUserBusiness';
import UserBusiness from '../application/businesses/UserBusiness';
import PermissionBusiness from '../application/businesses/PermissionBusiness';
import IPermissionBusiness from '../application/businesses/interfaces/IPermissionBusiness';
import SystemClaim from '../resources/permissions/SystemClaim'; // eslint-disable-line
import getRoles from '../resources/initialization/Roles';
import getPermissions from '../resources/initialization/Permissions';
import getUsers from '../resources/initialization/Users';

@Service()
@JsonController('/systems')
export default class SystemController {
    @Inject(() => RoleBusiness)
    private roleBusiness: IRoleBusiness;
    @Inject(() => UserBusiness)
    private userBusiness: IUserBusiness;
    @Inject(() => PermissionBusiness)
    private permissionBusiness: IPermissionBusiness;

    @Post("/init-roles")
    // @Authorized(SystemClaim.INIT_DATA)
    initRoles(@Body() isRequired: boolean) {
        let initRoles = getRoles();
        return this.roleBusiness.initialRoles(initRoles, isRequired);
    }

    @Post("/init-users")
    // @Authorized(SystemClaim.INIT_DATA)
    initUsers(@Body() isRequired: boolean) {
        let initUsers = getUsers();
        return this.userBusiness.initialUsers(initUsers, isRequired);
    }

    @Post("/init-permissions")
    // @Authorized(SystemClaim.INIT_DATA)
    initPermissions(@Body() isRequired: boolean) {
        let initPermissions = getPermissions();
        return this.permissionBusiness.initialPermissions(initPermissions, isRequired);
    }
}
