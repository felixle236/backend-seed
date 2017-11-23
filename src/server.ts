import * as express from 'express';
import * as http from 'http';
import * as cluster from 'cluster';
import * as os from 'os';
import Project from './config/Project';
import MiddlewareLoader from './system/MiddlewareLoader';
import DataAccess from './app/dataAccess/DataAccess';
import InitialData from './system/InitialData';
import DataLoader from './system/DataLoader';

const app = express();
const port = Project.PORT;

app.set('port', port);
app.use(MiddlewareLoader.configuration);

DataAccess.connect();
const debug = require('debug')('express-mongodb:server');

if (process.env.NODE_ENV === 'Development' && process.env.DEBUG_MODE) {
    initData();
    createHttpServer();
    console.log('\x1b[32m', '\nhttp://localhost' + (port !== 80 ? ':' + port : '') + '\n', '\x1b[0m');
}
else {
    if (cluster.isMaster) {
        console.log('\x1b[32m', '\nhttp://localhost' + (port !== 80 ? ':' + port : '') + '\n', '\x1b[0m');
        console.log(`Master ${process.pid} is running`);
        DataLoader.initMasterEvent(cluster);

        initData().then(() => {
            let numCPUs = os.cpus().length;

            // Fork workers.
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
            });
            console.log(`Master ${process.pid} is started`);
        });
    }
    else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        createHttpServer();
        DataLoader.initWorkerEvent();
        console.log(`Worker ${process.pid} is started`);
    }
}

async function initData(): Promise<void> {
    await (new InitialData()).init();
    await DataLoader.loadAll();
}

function createHttpServer() {
    /**
     * Create HTTP server.
     */
    let server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);

    server.on('listening', () => {
        let addr = server.address();
        let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    });
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    /* eslint-disable */
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
    /* eslint-enable */
}
