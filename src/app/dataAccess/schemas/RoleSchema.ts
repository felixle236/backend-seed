import * as mongoose from 'mongoose'; // eslint-disable-line
import DataAccess from '../DataAccess';
import IRole from '../../model/role/interfaces/IRole'; // eslint-disable-line

class RoleSchema {
    static get schema() {
        let schemaDefinition: mongoose.SchemaDefinition = {
            name: {
                type: String,
                required: true,
                unique: true,
                trim: true,
                min: 4,
                max: 50
            },
            order: {
                type: Number,
                default: 1,
                min: 1
            },

            claims: [String]
        };

        return DataAccess.initSchema(schemaDefinition);
    }
}

export default DataAccess.connection.model<IRole>('Role', RoleSchema.schema);
