import * as mongoose from 'mongoose';
import MongoAccess from 'multi-layer-pattern/dataAccess/MongoAccess';
import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line

class UserSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            firstName: {
                type: String,
                required: true,
                min: 2,
                max: 20
            },
            lastName: {
                type: String,
                required: true,
                min: 2,
                max: 20
            },
            fullName: {
                type: String,
                required: true,
                min: 4,
                max: 50
            },
            email: {
                type: String,
                required: true,
                unique: true,
                max: 100
            },
            password: String,
            avatar: String,
            gender: Number,
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
            role: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            },
            token: new mongoose.Schema({
                provider: Number,
                providerName: String,
                accessToken: String,
                tokenExpire: Date
            }, {_id: false}),
            claims: {
                type: [String],
                default: []
            }
        };

        return MongoAccess.initSchema(schemaDefinition);
    }
}

export default MongoAccess.connection.model<IUser>('User', UserSchema.schema);
