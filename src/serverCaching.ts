import * as express from 'express';
import * as http from 'http';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import Project from './config/Project';
import CachingAccess from './app/dataAccess/CachingAccess';
import DataCaching from './system/DataCaching';
const debug = require('debug')('express-mongodb:server');

export default function createServerCaching() {
    let port = Project.PORT_CACHING;
    let app = express();
    CachingAccess.init();

    console.log('\x1b[32m', `\nhttp://localhost:${port}`, '\x1b[0m');
    console.log('\x1b[32m', `\nServer caching is running.\n`, '\x1b[0m');

    app.use(logger('dev'));
    app.use(bodyParser.json({limit: 1048576}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(DataCaching.init());
    return createHttpServer(app, port);
}

function createHttpServer(app: express.Express, port: number) {
    /**
     * Create HTTP server.
     */
    app.set('port', port);
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

    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
        if (error.syscall !== 'listen')
            throw error;

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
    return server;
}
