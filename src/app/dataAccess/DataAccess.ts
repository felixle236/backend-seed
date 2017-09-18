import * as mongoose from 'mongoose';

class DataAccess {
    static get connection(): mongoose.Connection {
        return mongoose.connection;
    }

    static connect(connectionString: string): mongoose.Connection {
        (<any>mongoose).Promise = Promise;

        // mongoose.connection.once('open', () => {
        //     console.log('Connected to mongodb.');
        // });
        mongoose.connect(connectionString, {
            useMongoClient: true,
        });

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

        schema.pre('update', function(this: any, next) {
            // this.update({}, {$set: {updatedAt: new Date()}});
            this.updatedAt = new Date(); // eslint-disable-line
            next();
        });

        return schema;
    }
}

export default DataAccess;
