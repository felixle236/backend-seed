import * as mongoose from 'mongoose';
import IRole from '../../role/interfaces/IRole';

interface IPermission extends mongoose.Document {
    role: string | IRole;
    claim: number;
}

export default IPermission;
