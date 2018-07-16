import {GenderType, RoleCode} from '../../application/models/common/CommonType';

/**
 * Get init user list
 * @returns {*} List user
 */
export default function getUsers(): {isRequired: boolean, data: any}[] {
    return [
        {isRequired: true, data: {firstName: 'Admin', lastName: 'Local', email: 'admin@localhost.com', password: '123456', gender: GenderType.Male, roleCode: RoleCode.Administrator}},
        {isRequired: false, data: {firstName: 'Manager', lastName: 'Local', email: 'manager@localhost.com', password: '123456', gender: GenderType.Female, roleCode: RoleCode.ProductManager}},
        {isRequired: false, data: {firstName: 'Free', lastName: 'Account', email: 'free.account@localhost.com', password: '123456', gender: GenderType.Male, roleCode: RoleCode.UserCommon}}
    ];
}
