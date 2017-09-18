import Claim from '../../config/Claim';

export default function getRoleClaims(): {isRequired: boolean, data: any}[] {
    return [
        {isRequired: true, data: {name: 'Administrator', claims: [Claim.FULL_ACCESS]}},
        {isRequired: false, data: {name: 'Product Manager', claims: [Claim.ACCESS_PAGE_ADMIN]}},
    ];
}
