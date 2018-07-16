import {RoleCode} from '../../application/models/common/CommonType';

/**
 * Get init role list
 * @returns {*} List role
 */
export default function getRoles(): {isRequired: boolean, data: any}[] {
    return [
        {isRequired: true, data: {code: RoleCode.Administrator, name: 'Administrator', level: 1}},
        {isRequired: false, data: {code: RoleCode.ProductManager, name: 'Product Manager', level: 2}},
        {isRequired: false, data: {code: RoleCode.UserCommon, name: 'User Common', level: 3}}
    ];
}
