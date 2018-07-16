import IUser from './interfaces/IUser'; // eslint-disable-line
import {GenderType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

export default class UserProfile {
    public firstName: string;
    public lastName: string;
    public email: string;
    public avatar?: string;
    public gender?: GenderType;
    public birthday?: Date;
    public phone?: string;
    public address?: string;
    public culture?: string;
    public currency?: string;

    public constructor(data: IUser | undefined) {
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
