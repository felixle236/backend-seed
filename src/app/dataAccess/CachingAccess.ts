import * as Datastore from 'nedb';

class CachingAccess {
    static db = {
        users: new Datastore(),
        roles: new Datastore()
    };

    static init() {
        CachingAccess.db.users.ensureIndex(<any>{fieldName: 'cachedAt', expireAfterSeconds: 1800});

        CachingAccess.db.roles.ensureIndex({fieldName: 'code', unique: true});
        CachingAccess.db.roles.ensureIndex({fieldName: 'name', unique: true});
    }
}

Object.seal(CachingAccess);
export default CachingAccess;
