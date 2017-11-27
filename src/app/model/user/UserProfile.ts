import {sealed} from '../../../helpers/InjectionHelper'; // eslint-disable-line
import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line
import {GenderType} from '../../model/common/CommonType';

@sealed
class UserProfile {
    name: string;
    email: string;
    avatar?: string;
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
        this.email = model.email;
        this.avatar = model.avatar;
        this.gender = model.gender;
        this.birthday = model.birthday;
        this.phone = model.phone;
        this.address = model.address;
        this.culture = model.culture;
        this.currency = model.currency;
    }
}

export default UserProfile;
