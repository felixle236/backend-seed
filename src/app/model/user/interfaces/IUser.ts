import IBaseModel from '../../common/interfaces/IBaseModel';
import UserToken from '../UserToken';
import {GenderType} from '../../common/CommonType';

interface IUser extends IBaseModel {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password?: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
    role?: any;
    token?: UserToken;
    claims: string[];
}

export default IUser;
