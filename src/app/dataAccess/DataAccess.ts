import * as mongoose from 'mongoose';
import Project from '../../config/Project';

class DataAccess {
    static get connection(): mongoose.Connection {
        return mongoose.connection;
    }

    static connect(uri?: string, options?: any): mongoose.Connection {
        (<any>mongoose).Promise = Promise;

        if (!uri)
            uri = Project.DB_CONN_URI;

        if (!options)
            options = {};
        options.useMongoClient = true;

        if (process.env.NODE_ENV !== 'Development') {
            options.user = Project.DATABASE.USERNAME;
            options.pass = Project.DATABASE.PASSWORD;
        }

        mongoose.connect(uri, options);
        return mongoose.connection;
    }

    static initSchema(schemaDefinition: mongoose.SchemaDefinition): mongoose.Schema {
        schemaDefinition.createdAt = {
            type: Date,
            default: new Date()
        };
        schemaDefinition.updatedAt = {
            type: Date,
            default: new Date()
        };
        schemaDefinition.deletedAt = {
            type: Date,
            default: null
        };

        let schema = new mongoose.Schema(schemaDefinition);

        // schema.pre('update', function(this: any, next) {
        //     console.log('schema.pre', this.updatedAt); // eslint-disable-line
        //     this.updatedAt = new Date(); // eslint-disable-line
        //     next();
        // });

        schema.pre('update', function(this: any) {
            try {
                this.update({}, {$set: {updatedAt: new Date()}}); // eslint-disable-line
            }
            catch (error) {
                console.error('Schema pre update', error);
            }
        });

        return schema;
    }
}

Object.seal(DataAccess);
export default DataAccess;
