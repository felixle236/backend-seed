import IBaseModel from '../../common/interfaces/IBaseModel';
import UserToken from '../UserToken';
import GenderType from '../enums/GenderType';

interface IUser extends IBaseModel {
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
    roles?: string[];
    claims?: string[];
}

export default IUser;
