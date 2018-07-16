import * as mongoose from 'mongoose'; // eslint-disable-line
import MongoAccess from '../dataAccess/MongoAccess';
import IPermission from '../models/permission/interfaces/IPermission'; // eslint-disable-line

class PermissionSchema {
    public static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            role: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role',
                required: true
            },
            claim: {
                type: Number,
                required: true,
                min: 1
            }
        };

        let schema = MongoAccess.initSchema(schemaDefinition, false);
        schema.index({role: 1, claim: 1}, {unique: true});
        return schema;
    }
}

export default MongoAccess.connection.model<IPermission>('Permission', PermissionSchema.schema);
