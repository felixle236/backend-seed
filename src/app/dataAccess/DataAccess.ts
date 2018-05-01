import * as mongoose from 'mongoose';
import Project from '../../config/Project';
import {ErrorCommon} from '../model/common/Error';

class DataAccess {
    static get connection(): mongoose.Connection {
        return mongoose.connection;
    }

    static async connect(name?: string): Promise<mongoose.Connection> {
        (<any>mongoose).Promise = Promise;

        if (!Project.DATABASES || !Project.DATABASES.length)
            throw new ErrorCommon(11);

        let db = Project.DATABASES.find(db => db.NAME === name) || Project.DATABASES.find(db => db.NAME === 'default') || Project.DATABASES[0];
        let uri = `mongodb://${db.HOST}:${db.PORT}/${db.DB_NAME}`;

        let options = <any>{
            poolSize: 10, // default is 5
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500 // Reconnect every 500ms
        };

        if (db.USERNAME && db.PASSWORD) {
            options.user = db.USERNAME;
            options.pass = db.PASSWORD;
        }

        await mongoose.connect(uri, options);
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
            type: Date
        };

        let schema = new mongoose.Schema(schemaDefinition);

        schema.pre('update', function(this: any, next) {
            this.updatedAt = Date.now; // eslint-disable-line
            next();
        });

        return schema;
    }
}

Object.seal(DataAccess);
export default DataAccess;
