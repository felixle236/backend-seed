import {RoleCode} from '../../app/model/common/CommonType';

export default function getUserRoles(): {isRequired: boolean, data: any}[] {
    return [
        {isRequired: true, data: {email: 'admin@localhost.com', roleCode: RoleCode.Administrator}},
        {isRequired: false, data: {email: 'felix.le.236@gmail.com', roleCode: RoleCode.ProductManager}},
    ];
}
