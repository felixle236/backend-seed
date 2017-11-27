import {sealed} from '../../../helpers/InjectionHelper'; // eslint-disable-line
import IUser from './interfaces/IUser'; // eslint-disable-line
import {GenderType} from '../common/CommonType';

@sealed
class UserUpdate {
    name: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;

    constructor(model: IUser) {
        if (!model)
            return;

        this.name = model.name;
        this.gender = model.gender;
        this.birthday = model.birthday;
        this.phone = model.phone;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;
    }
}

export default UserUpdate;
