import IBaseModel from '../../common/interfaces/IBaseModel';
import IRole from '../../role/interfaces/IRole';
import UserToken from '../UserToken';
import {GenderType} from '../../common/CommonType';

interface IUser extends IBaseModel {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
    token?: UserToken;
    role: string | IRole;
}

export default IUser;
