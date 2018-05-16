import 'mocha';
import BusinessLoader from '../../system/BusinessLoader';
import DataAccess from '../../app/dataAccess/DataAccess';

let connection;

before(done => {
    DataAccess.connect('test').then(async conn => {
        connection = conn;
        await connection.db.dropDatabase();
        BusinessLoader.init();

        done();
    });
});

after(done => {
    connection.db.dropDatabase().then(() => {
        connection.close();
        done();
    });
});
