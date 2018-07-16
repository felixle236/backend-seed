import IUser from './interfaces/IUser'; // eslint-disable-line
import RoleLookup from '../role/RoleLookup';
import {GenderType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

export default class UserView {
    public id: string;
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
    public role: string | RoleLookup;
    public createdAt: Date;
    public updatedAt: Date;

    public constructor(data: IUser | undefined) {
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

    public static parseArray(list: IUser[]) {
        return list && Array.isArray(list) ? list.map(item => new UserView(item)) : [];
    }
}
