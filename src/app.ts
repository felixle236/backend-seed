import 'reflect-metadata';
import * as os from 'os';
import * as cluster from 'cluster';
import {Container} from 'typedi';
import * as routing from 'routing-controllers';
import * as validator from 'class-validator';
import config from './configuration';
import createHttpServer from './system/Server';
import CachingAccess from './application/dataAccess/CachingAccess';
import MongoAccess from './application/dataAccess/MongoAccess';
import CachingBusiness from './application/businesses/CachingBusiness';
const DATABASE = config.DATABASES.find(db => db.NAME === 'default');
if (!DATABASE) throw new routing.InternalServerError('Not found database configuration!');

routing.useContainer(Container);
validator.useContainer(Container);

if (process.env.NODE_ENV === 'development') {
    CachingAccess.createDBConnection();
    MongoAccess.createDBConnection(DATABASE.HOST, DATABASE.PORT, DATABASE.DB_NAME, DATABASE.USERNAME, DATABASE.PASSWORD).then(() => {
        Container.get(CachingBusiness).fetchPermissionCaching();
    });
    createHttpServer(config.PORT_CACHING);
    createHttpServer(config.PORT);
    console.log('\nCaching Server', '\x1b[32m', 'http://localhost' + (config.PORT_CACHING !== 80 ? ':' + config.PORT_CACHING : ''), '\x1b[0m'); // eslint-disable-line
    console.log('\nHttp Server', '\x1b[32m', 'http://localhost' + (config.PORT !== 80 ? ':' + config.PORT : ''), '\x1b[0m', '\n'); // eslint-disable-line
} else {
    if (cluster.isMaster) {
        CachingAccess.createDBConnection();
        MongoAccess.createDBConnection(DATABASE.HOST, DATABASE.PORT, DATABASE.DB_NAME, DATABASE.USERNAME, DATABASE.PASSWORD).then(() => {
            Container.get(CachingBusiness).fetchPermissionCaching();
        });
        createHttpServer(config.PORT_CACHING);
        console.log('\nCaching Server', '\x1b[32m', 'http://localhost' + (config.PORT_CACHING !== 80 ? ':' + config.PORT_CACHING : ''), '\x1b[0m'); // eslint-disable-line
        console.log('\nHttp Server', '\x1b[32m', 'http://localhost' + (config.PORT !== 80 ? ':' + config.PORT : ''), '\x1b[0m', '\n'); // eslint-disable-line

        let numCPUs = os.cpus().length;
        // Fork workers.
        for (let i = 0; i < numCPUs; i++)
            cluster.fork();

        cluster.on('exit', (worker, code, signal) => {
            cluster.fork();
            console.log(`worker ${worker.process.pid} died`); // eslint-disable-line
        });
        console.log(`Master ${process.pid} is started`); // eslint-disable-line
    } else {
        MongoAccess.createDBConnection(DATABASE.HOST, DATABASE.PORT, DATABASE.DB_NAME, DATABASE.USERNAME, DATABASE.PASSWORD);
        createHttpServer(config.PORT);
        console.log(`Worker ${process.pid} is started`); // eslint-disable-line
    }
}
