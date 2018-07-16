import {RoleCode} from '../../application/models/common/CommonType';
import SystemClaim from '../permissions/SystemClaim';
import RoleClaim from '../permissions/RoleClaim';
import UserClaim from '../permissions/UserClaim';

/**
 * Get init permission list
 * @returns {*} List permission
 */
export default function getPermissions(): {isRequired: boolean, data: any}[] {
    return [
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: SystemClaim.INIT_DATA}},
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: RoleClaim.GET}},
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: RoleClaim.CREATE}},
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: RoleClaim.UPDATE}},
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: RoleClaim.DELETE}},
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: UserClaim.GET}},
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: UserClaim.CREATE}},
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: UserClaim.UPDATE}},
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: UserClaim.UPDATE_ROLE}},
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claim: UserClaim.DELETE}},
        {isRequired: false, data: {roleCode: RoleCode.ProductManager, claim: RoleClaim.GET}}
    ];
}
