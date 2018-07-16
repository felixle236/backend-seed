import * as Datastore from 'nedb';

const cachingDatabase = {
    users: new Datastore(),
    permissions: new Datastore()
};

export default class CachingAccess {
    public static get users(): Datastore {
        return cachingDatabase.users;
    };
    public static get permissions(): Datastore {
        return cachingDatabase.permissions;
    };

    public static createDBConnection() {
        cachingDatabase.users.ensureIndex({fieldName: 'expirationDate', expireAfterSeconds: 1200} as Datastore.EnsureIndexOptions);

        cachingDatabase.permissions.ensureIndex({fieldName: 'role'} as Datastore.EnsureIndexOptions);
        cachingDatabase.permissions.ensureIndex({fieldName: 'claim'} as Datastore.EnsureIndexOptions);
    }
}
