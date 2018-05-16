import 'mocha';
import Project from '../../config/Project';
import createServerCaching from '../../system/DataCaching';

let server;

before(done => {
    Project.PORT_CACHING = 2900;
    server = createServerCaching();

    done();
});

after(done => {
    server.close(done);
    console.log('\x1b[32m', `Server caching was stopped.\n`, '\x1b[0m');
});
