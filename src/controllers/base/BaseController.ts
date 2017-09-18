import * as express from 'express';

class BaseController {
    private router: express.Router;
    protected maxRecords: number = 30;

    constructor() {
        this.router = express.Router(); // eslint-disable-line

        let idRegex = /[0-9a-z]{24}/;
        let numRegex = /^[0-9]{1,9}$/;

        this.router.param('_id', this.validateRegExp(idRegex));
        this.router.param('page', this.validateRegExp(numRegex, (req, res, next, page) => {
            if (!page)
                req.params.page = 1;
            else if (typeof req.params.page === 'string')
                req.params.page = Number(req.params.page);
            next();
        }));
        this.router.param('limit', this.validateRegExp(numRegex, (req, res, next, limit) => {
            if (!limit || limit > this.maxRecords)
                req.params.limit = this.maxRecords;
            else if (typeof req.params.limit === 'string')
                req.params.limit = Number(req.params.limit);
            next();
        }));
    }

    getRouter() {
        return this.router;
    }

    private validateRegExp(regex: RegExp, cb?: Function): express.RequestParamHandler {
        return (req, res, next, val) => {
            if (regex.test(val))
                cb ? cb(req, res, next, val) : next();
            else
                next('route');
        };
    }

    protected get(path: string, ...handlers: express.RequestHandler[]): void {
        this.router.get(path, this.handleRequest(handlers));
    }

    protected post(path: string, ...handlers: express.RequestHandler[]): void {
        this.router.post(path, this.handleRequest(handlers));
    }

    protected put(path: string, ...handlers: express.RequestHandler[]): void {
        this.router.put(path, this.handleRequest(handlers));
    }

    protected delete(path: string, ...handlers: express.RequestHandler[]): void {
        this.router.delete(path, this.handleRequest(handlers));
    }

    private handleRequest(handlers: express.RequestHandler[]): express.RequestHandler[] {
        if (handlers.length > 0) {
            let handler = handlers[handlers.length - 1];

            handlers[handlers.length - 1] = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                let handlerResult = handler(req, res, next);
                if (!res.headersSent) {
                    if (handlerResult && typeof handlerResult['then'] === 'function')
                        handlerResult.then(data => {
                            this.showConsole(data);
                            res.send({data: data});
                        }).catch(err => {
                            this.showConsole(err);
                            res.status(400);
                            res.send({error: {message: err.message}});
                        });
                    else {
                        this.showConsole(handlerResult);
                        res.send({data: handlerResult});
                    }
                }
            };

            return handlers;
        }
        else
            throw new Error('The router must have request handler function!');
    }

    private showConsole(obj) {
        if (process.env.NODE_ENV == 'development')
            console.log(obj);
    }
}

export default BaseController;
