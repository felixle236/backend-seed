import IUser from './interfaces/IUser'; // eslint-disable-line
import {GenderType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

class User {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
    role?: any;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IUser) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.fullName;
        this.email = model.email;
        this.avatar = DataHelper.handleFileDataModel(model.avatar);
        this.gender = model.gender;
        this.birthday = model.birthday;
        this.phone = model.phone;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;
        this.role = DataHelper.handleIdDataModel(model.role);

        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IUser[]): User[] {
        return list && Array.isArray(list) ? list.map(item => new User(item)) : [];
    }
}

Object.seal(User);
export default User;
