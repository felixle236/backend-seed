import * as mongoose from 'mongoose';

export default class MongoAccess {
    public static get connection(): mongoose.Connection {
        return mongoose.connection;
    }

    public static createDBConnection(host: string, port: number, dbName: string, username?: string, password?: string): Promise<mongoose.Connection> {
        (mongoose as any).Promise = Promise;
        let uri = `mongodb://${host}:${port}/${dbName}`;

        let options = {
            user: username,
            pass: password,
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            useNewUrlParser: true
        } as mongoose.ConnectionOptions;

        return mongoose.connect(uri, options).then(mongo => mongo.connection);
    }

    public static initSchema(schemaDefinition: mongoose.SchemaDefinition, isUseFlag: boolean = true): mongoose.Schema {
        if (isUseFlag) {
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
        }
        let schema = new mongoose.Schema(schemaDefinition);

        if (isUseFlag) {
            schema.pre('update', function() {
                this.update({}, { $set: { updatedAt: new Date() } });
            });
        }
        return schema;
    }
}
