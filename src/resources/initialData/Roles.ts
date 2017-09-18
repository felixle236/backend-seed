import RoleCreate from '../../app/model/role/RoleCreate';

export default function getRoles(): {isRequired: boolean, data: RoleCreate}[] {
    return [
        {isRequired: true, data: <RoleCreate>{name: 'Administrator', order: 1}},
        {isRequired: false, data: <RoleCreate>{name: 'Product Manager', order: 2}},
    ];
}
