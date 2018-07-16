import IBaseModel from '../../common/interfaces/IBaseModel';

interface IRole extends IBaseModel {
    code: number;
    name: string;
    level: number;
}

export default IRole;
