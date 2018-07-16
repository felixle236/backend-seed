import * as mongoose from 'mongoose';
import MongoAccess from '../dataAccess/MongoAccess';
import IUser from '../models/user/interfaces/IUser'; // eslint-disable-line

class UserSchema {
    public static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            firstName: {
                type: String,
                required: true,
                max: 20
            },
            lastName: {
                type: String,
                required: true,
                max: 20
            },
            fullName: {
                type: String,
                required: true,
                max: 50
            },
            email: {
                type: String,
                required: true,
                unique: true,
                max: 100
            },
            password: {
                type: String,
                required: true
            },
            avatar: String,
            gender: Number,
            birthday: Date,
            phone: {
                type: String,
                trim: true,
                max: 20
            },
            address: {
                type: String,
                trim: true,
                max: 200
            },
            culture: {
                type: String,
                trim: true,
                max: 5
            },
            currency: {
                type: String,
                trim: true,
                max: 3
            },
            token: new mongoose.Schema({
                provider: Number,
                providerName: String,
                accessToken: String,
                tokenExpire: Date
            }, {_id: false}),
            role: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role',
                required: true
            }
        };

        return MongoAccess.initSchema(schemaDefinition);
    }
}

export default MongoAccess.connection.model<IUser>('User', UserSchema.schema);
