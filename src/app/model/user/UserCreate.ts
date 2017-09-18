import IUser from './interfaces/IUser'; // eslint-disable-line
import GenderType from './enums/GenderType';
import UserToken from './UserToken';

class UserCreate {
    name: string;
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

        this.name = model.name;
        this.email = model.email;
        this.password = model.password;
        this.avatar = model.avatar;
        this.gender = model.gender;
        this.birthday = model.birthday;
        this.phone = model.phone;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;

        this.token = new UserToken();
    }
}

Object.seal(UserCreate);
export default UserCreate;
