import RoleCreate from '../../app/model/role/RoleCreate';
import {RoleCode} from '../../app/model/common/CommonType';

export default function getRoles(): {isRequired: boolean, data: RoleCreate}[] {
    return [
        {isRequired: true, data: <RoleCreate>{code: RoleCode.Administrator, name: 'Administrator', level: 1}},
        {isRequired: false, data: <RoleCreate>{code: RoleCode.ProductManager, name: 'Product Manager', level: 2}},
    ];
}
