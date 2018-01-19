import * as mongoose from 'mongoose';
import Project from '../../config/Project';

class DataAccess {
    static get connection(): mongoose.Connection {
        return mongoose.connection;
    }

    static connect(uri?: string): mongoose.Connection {
        (<any>mongoose).Promise = Promise;

        if (!uri)
            uri = Project.DB_CONN_URI;

        let options = <any>{
            poolSize: 10, // default is 5
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500 // Reconnect every 500ms
        };

        if (process.env.NODE_ENV !== 'Development' && Project.DATABASE.USERNAME) {
            options.user = Project.DATABASE.USERNAME;
            options.pass = Project.DATABASE.PASSWORD;
        }

        mongoose.connect(uri, options);
        return mongoose.connection;
    }

    static initSchema(schemaDefinition: mongoose.SchemaDefinition): mongoose.Schema {
        schemaDefinition.createdAt = {
            type: Date,
            default: Date.now
        };
        schemaDefinition.updatedAt = {
            type: Date,
            default: Date.now
        };
        schemaDefinition.deletedAt = {
            type: Date,
            default: null
        };

        let schema = new mongoose.Schema(schemaDefinition);

        schema.pre('update', function(this: any) {
            this.update({}, {$set: {updatedAt: Date.now()}}); // eslint-disable-line
        });

        return schema;
    }
}

Object.seal(DataAccess);
export default DataAccess;
