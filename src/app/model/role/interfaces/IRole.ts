import IBaseModel from '../../common/interfaces/IBaseModel';

interface IRole extends IBaseModel {
    name: string;
    order?: number;
    claims?: string[];
}

export default IRole;
