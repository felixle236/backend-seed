import * as mongoose from 'mongoose'; // eslint-disable-line
import MongoDB from 'multi-layer-pattern/dataAccess/MongoDB';
import IRole from '../../model/role/interfaces/IRole'; // eslint-disable-line

class RoleSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            code: {
                type: Number,
                required: true,
                unique: true,
                min: 1
            },
            name: {
                type: String,
                required: true,
                unique: true,
                min: 4,
                max: 50
            },
            level: {
                type: Number,
                default: 1,
                min: 1
            },
            claims: {
                type: [String],
                default: []
            }
        };

        return MongoDB.initSchema(schemaDefinition);
    }
}

export default MongoDB.connection.model<IRole>('Role', RoleSchema.schema);
