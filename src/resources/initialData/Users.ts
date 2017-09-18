import UserCreate from '../../app/model/user/UserCreate';
import GenderType from '../../app/model/user/enums/GenderType';

export default function getUsers(): {isRequired: boolean, data: UserCreate}[] {
    return [
        {isRequired: true, data: <UserCreate>{name: 'Admin', email: 'admin@gmail.com', password: '123456', avatar: undefined, gender: GenderType.Male, birthday: undefined, phone: undefined, address: undefined, culture: undefined, currency: undefined}},
        {isRequired: false, data: <UserCreate>{name: 'Felix Le', email: 'felix.le.236@gmail.com', password: '123456', avatar: undefined, gender: GenderType.Male, birthday: undefined, phone: undefined, address: undefined, culture: undefined, currency: undefined}},
    ];
}
