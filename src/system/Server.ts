import * as path from 'path';
import * as express from 'express'; // eslint-disable-line
import * as compression from 'compression';
import {createExpressServer} from 'routing-controllers';
import {LoggingMiddleware} from './LoggingMiddleware';
import {ErrorMiddleware} from './ErrorMiddleware';
import Authenticator from './Authenticator';
import FileHelper from '../helpers/FileHelper';

/**
 * Create http server
 * @param {number} port Define port number
 * @returns {express.Express} Server express
 */
export default function createHttpServer(port: number): express.Express {
    let directory = path.join(__dirname, '../controllers');
    let controllers = FileHelper.getImportFiles(directory);
    let app: express.Express = createExpressServer({
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: ['Authorization', 'X-Api-Version'],
            maxAge: 3600,
            preflightContinue: true,
            optionsSuccessStatus: 204
        },
        routePrefix: '/api',
        controllers,
        middlewares: [LoggingMiddleware, ErrorMiddleware],
        authorizationChecker: Authenticator.authorizationChecker,
        currentUserChecker: Authenticator.currentUserChecker
    });

    app.use(compression({filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res)}));
    app.listen(port);

    return app;
}
