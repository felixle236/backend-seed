import IBaseModel from '../../common/interfaces/IBaseModel';

interface IRole extends IBaseModel {
    code: number;
    name: string;
    level: number;
    claims: string[];
}

export default IRole;
