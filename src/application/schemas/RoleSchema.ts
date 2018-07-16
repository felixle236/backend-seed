import * as mongoose from 'mongoose'; // eslint-disable-line
import MongoAccess from '../dataAccess/MongoAccess';
import IRole from '../models/role/interfaces/IRole'; // eslint-disable-line

class RoleSchema {
    public static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            code: {
                type: Number,
                required: true,
                unique: true,
                min: 1,
                max: 100
            },
            name: {
                type: String,
                required: true,
                unique: true,
                max: 50
            },
            level: {
                type: Number,
                default: 1,
                min: 1,
                max: 100
            }
        };

        return MongoAccess.initSchema(schemaDefinition);
    }
}

export default MongoAccess.connection.model<IRole>('Role', RoleSchema.schema);
