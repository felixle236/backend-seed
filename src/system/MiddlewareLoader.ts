import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import Authenticator from './Authenticator';
import RouteLoader from './RouteLoader';

class MiddlewareLoader {
    static get configuration() {
        let app = express();

        if (process.env.NODE_ENV == 'development')
            app.use(logger('dev'));

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(express.static(path.join(__dirname, '../../upload')));

        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
            next();
        });

        app.use(new Authenticator().getConfig());
        app.use(new RouteLoader().getRouters());

        // catch 404 and forward to error handler
        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(404);
            res.send({error: {message: 'Not Found!'}});
        });

        // error handler
        app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err);
            res.status(500);
            res.send({error: {message: 'Occurred an error!'}});
        });

        return app;
    }
}

Object.seal(MiddlewareLoader);
export default MiddlewareLoader;
