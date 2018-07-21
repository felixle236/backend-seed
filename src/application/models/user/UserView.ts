import IUser from './interfaces/IUser'; // eslint-disable-line
import RoleLookup from '../role/RoleLookup';
import {GenderType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

export default class UserView {
    id: string;
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
    role: string | RoleLookup;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: IUser | undefined) {
        if (!data)
            return;

        this.id = data.id;
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
        this.role = DataHelper.handleDataModel(data.role, RoleLookup);
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static parseArray(list: IUser[]): UserView[] {
        return list && Array.isArray(list) ? list.map(item => new UserView(item)) : [];
    }
}
