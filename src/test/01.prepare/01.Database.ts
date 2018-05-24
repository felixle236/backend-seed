import 'mocha';
import Project from '../../config/Project';
import MongoAccess from 'multi-layer-pattern/dataAccess/MongoAccess';

let connection;

before(done => {
    const db = Project.DATABASES.find(db => db.NAME === 'test')!;
    MongoAccess.connect(db.HOST, db.PORT, db.DB_NAME, db.USERNAME, db.PASSWORD).then(async conn => {
        connection = conn;
        await connection.db.dropDatabase();

        done();
    });
});

after(done => {
    connection.db.dropDatabase().then(() => {
        connection.close();
        done();
    });
});
