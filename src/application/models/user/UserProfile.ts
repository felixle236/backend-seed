import IUser from './interfaces/IUser'; // eslint-disable-line
import {GenderType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

export default class UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;

    constructor(data: IUser | undefined) {
        if (!data)
            return;

        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.avatar = DataHelper.handleFileModel(data.avatar);
        this.gender = data.gender;
        this.birthday = data.birthday;
        this.phone = data.phone;
        this.address = data.address;
        this.culture = data.culture;
        this.currency = data.currency;
    }
}
