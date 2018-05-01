import IUser from './interfaces/IUser'; // eslint-disable-line
import {GenderType} from '../common/CommonType';
import UserToken from './UserToken';

class UserCreate {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password?: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
    token?: UserToken;

    constructor(model: IUser) {
        if (!model)
            return;

        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.firstName + ' ' + model.lastName;
        this.email = model.email;
        this.password = model.password;
        this.avatar = model.avatar;
        this.gender = model.gender;
        this.birthday = model.birthday;
        this.phone = model.phone;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;
        this.token = new UserToken(<any>{});
    }
}

Object.seal(UserCreate);
export default UserCreate;
