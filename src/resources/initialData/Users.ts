import UserCreate from '../../app/model/user/UserCreate';
import {GenderType} from '../../app/model/common/CommonType';

export default function getUsers(): {isRequired: boolean, data: UserCreate}[] {
    return [
        {isRequired: true, data: <UserCreate>{firstName: 'Admin', lastName: 'Local', email: 'admin@localhost.com', password: '123456', gender: GenderType.Male}},
        {isRequired: false, data: <UserCreate>{firstName: 'Felix', lastName: 'Le', email: 'felix.le.236@gmail.com', password: '123456', gender: GenderType.Male}},
    ];
}
