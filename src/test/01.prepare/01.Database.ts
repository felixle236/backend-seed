import 'reflect-metadata';
import 'mocha';
import {InternalServerError} from 'routing-controllers';
import config from '../../configuration';
import CachingAccess from '../../application/dataAccess/CachingAccess';
import MongoAccess from '../../application/dataAccess/MongoAccess';

let connection;

before(done => {
    const DATABASE = config.DATABASES.find(db => db.NAME === 'test');
    if (!DATABASE) done(new InternalServerError('Not found database configuration!'));
    else {
        CachingAccess.createDBConnection();
        MongoAccess.createDBConnection(DATABASE.HOST, DATABASE.PORT, DATABASE.DB_NAME, DATABASE.USERNAME, DATABASE.PASSWORD).then(async conn => {
            connection = conn;
            await connection.db.dropDatabase();

            done();
        });
    }
});

after(done => {
    connection.db.dropDatabase().then(() => {
        connection.close();
        done();
    });
});
