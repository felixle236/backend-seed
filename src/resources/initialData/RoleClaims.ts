import {RoleCode, Claim} from '../../app/model/common/CommonType';

export default function getRoleClaims(): {isRequired: boolean, data: any}[] {
    return [
        {isRequired: true, data: {roleCode: RoleCode.Administrator, claims: [Claim.FULL_ACCESS]}},
        {isRequired: false, data: {roleCode: RoleCode.ProductManager, claims: [Claim.ACCESS_PAGE_ADMIN]}},
    ];
}
