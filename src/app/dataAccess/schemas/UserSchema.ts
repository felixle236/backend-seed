import * as mongoose from 'mongoose';
import DataAccess from '../DataAccess';
import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line

class UserSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            name: {
                type: String,
                required: true,
                trim: true,
                min: 4,
                max: 50
            },
            email: {
                type: String,
                required: true,
                unique: true,
                trim: true,
                max: 100
            },
            password: String,
            avatar: String,
            gender: {
                type: Number,
                default: null
            },
            birthday: Date,
            phone: {
                type: String,
                trim: true,
                max: 32
            },
            address: {
                type: String,
                trim: true,
                max: 200
            },
            culture: {
                type: String,
                trim: true
            },
            currency: {
                type: String,
                trim: true
            },

            roles: [mongoose.Schema.Types.ObjectId],
            claims: [String],
            token: mongoose.Schema.Types.Mixed
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IUser>('User', UserSchema.schema);
