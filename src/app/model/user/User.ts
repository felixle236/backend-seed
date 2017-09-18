import IUser from './interfaces/IUser'; // eslint-disable-line
import GenderType from './enums/GenderType';

class User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IUser) {
        if (!model)
            return;

        this._id = model._id && model._id.toString();
        this.name = model.name;
        this.email = model.email;
        this.avatar = model.avatar;
        this.gender = model.gender;
        this.birthday = model.birthday;
        this.phone = model.phone;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IUser[]): User[] {
        return list.map(item => new User(item));
    }
}

Object.seal(User);
export default User;
