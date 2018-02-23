import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';
import BusinessLoader from '../system/BusinessLoader';
import getRoles from '../resources/initialData/Roles';
import getRoleClaims from '../resources/initialData/RoleClaims';
import getUsers from '../resources/initialData/Users';
import getUserRoles from '../resources/initialData/UserRoles';

class InitialData {
    isRequired?: boolean;
    private roleBusiness: IRoleBusiness = BusinessLoader.roleBusiness;
    private userBusiness: IUserBusiness = BusinessLoader.userBusiness;

    async init(isRequired?: boolean): Promise<void> {
        this.isRequired = isRequired;

        await this.initRoles();
        await this.initRoleClaims();
        await this.initUsers();
        await this.initUserRoles();

        console.log('Initial Data ===> Done.');
    }

    async initRoles(): Promise<void> {
        let list = getRoles();

        let roles = await this.roleBusiness.getAll();
        let roleNames: string[] = roles.map(role => role.name.toLowerCase());

        for (let i = 0; i < list.length; i++) {
            let item = list[i];

            if ((item.isRequired || this.isRequired) && !roleNames.includes(item.data.name.toLowerCase())) {
                try {
                    await this.roleBusiness.create(item.data);
                    console.log(`Role '${item.data.name}' has created.`);
                }
                catch (error) {
                    console.log(`Role '${item.data.name}' cannot create with error`, error);
                }
            }
        }

        console.log(`Initialize roles have done.`);
    }

    async initRoleClaims(): Promise<void> {
        let roles = await this.roleBusiness.getAll();
        let roleClaims = getRoleClaims();

        for (let i = 0; i < roleClaims.length; i++) {
            let roleClaim = roleClaims[i];
            let role = roles.find(role => role.name.toLowerCase().includes(roleClaim.data.name.toLowerCase()));

            if ((roleClaim.isRequired || this.isRequired) && role) {
                let rcs = role.claims ? role.claims.slice() : [];

                roleClaim.data.claims.forEach(claim => {
                    if (!rcs.find(rc => rc.toLowerCase().includes(claim.toLowerCase())))
                        rcs.push(claim);
                });

                if ((role.claims || []).length !== rcs.length) {
                    try {
                        await this.roleBusiness.updateClaims(role._id, rcs);
                        console.log(`Role claims of '${role.name}' has created.`);
                    }
                    catch (error) {
                        console.log(`Role claims of '${role.name}' cannot create with error`, error);
                    }
                }
            }
        }

        console.log(`Initialize role claims have done.`);
    }

    async initUsers(): Promise<void> {
        let list = getUsers();

        for (let i = 0; i < list.length; i++) {
            let item = list[i];

            if ((item.isRequired || this.isRequired) && !(await this.userBusiness.getUserByEmail(item.data.email.toLowerCase()))) {
                try {
                    await this.userBusiness.create(item.data);
                    console.log(`User '${item.data.email}' has created.`);
                }
                catch (error) {
                    console.log(`User '${item.data.email}' cannot create with error`, error);
                }
            }
        }

        console.log(`Initialize users have done.`);
    }

    async initUserRoles(): Promise<void> {
        let roles = await this.roleBusiness.getAll();
        let userRoles = getUserRoles();

        for (let i = 0; i < userRoles.length; i++) {
            let userRole = userRoles[i];
            let user = await this.userBusiness.getUserByEmail(userRole.data.email.toLowerCase());

            if ((userRole.isRequired || this.isRequired) && user) {
                let permission = await this.userBusiness.getPermission(user._id);
                let urs = permission && permission.roles ? permission.roles : [];

                userRole.data.roles.forEach(roleName => {
                    let role = roles.find(role => role.name.toLowerCase().includes(roleName.toLowerCase()));
                    if (role && !urs.find(ur => ur.toString().includes(role!._id.toString())))
                        urs.push(role._id);
                });

                if (((permission && permission.roles) || []).length !== urs.length) {
                    try {
                        await this.userBusiness.updateRoles(user._id, urs);
                        console.log(`User roles of '${user.email}' has created.`);
                    }
                    catch (error) {
                        console.log(`User roles of '${user.email}' cannot create with error`, error);
                    }
                }
            }
        }

        console.log(`Initialize user roles have done.`);
    }
}

Object.seal(InitialData);
export default InitialData;
