import IUser from './interfaces/IUser'; // eslint-disable-line
import {GenderType} from '../common/CommonType';

class UserUpdate {
    firstName: string;
    lastName: string;
    fullName: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;

    constructor(model: IUser) {
        if (!model)
            return;

        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.fullName = model.firstName + ' ' + model.lastName;
        this.gender = model.gender;
        this.birthday = model.birthday;
        this.phone = model.phone;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;
    }
}

Object.seal(UserUpdate);
export default UserUpdate;
