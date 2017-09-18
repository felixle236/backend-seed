import * as mongoose from 'mongoose';

interface IBaseModel extends mongoose.Document {
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export default IBaseModel;
