import 'mocha';
import Project from '../../config/Project';
import createServerCaching from '../../serverCaching';
import BusinessLoader from '../../system/BusinessLoader';
import DataAccess from '../../app/dataAccess/DataAccess';
import IRoleBusiness from '../../app/business/interfaces/IRoleBusiness'; // eslint-disable-line

let server;
let connection;

before(done => {
    DataAccess.connect('test').then(async conn => {
        connection = conn;
        await connection.db.dropDatabase();

        BusinessLoader.init();
        Project.PORT_CACHING = 2900;
        server = createServerCaching();

        done();
    });
});

after(done => {
    connection.db.dropDatabase().then(() => {
        connection.close();
        server.close(done);
        console.log('\x1b[32m', `Server caching was stopped.\n`, '\x1b[0m');
    });
});
