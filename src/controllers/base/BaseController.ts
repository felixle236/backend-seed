import * as express from 'express';

class BaseController {
    private router: express.Router;
    protected idRegex = /[0-9a-z]{24}/;
    protected numRegex = /^[0-9]{1,9}$/;

    constructor() {
        this.router = express.Router(); // eslint-disable-line
        this.router.param('_id', this.validateRegExp(this.idRegex));
    }

    getRouter() {
        return this.router;
    }

    validatePagination(maxRecords: number = 30) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (!req.query.page || !req.query.limit || !this.numRegex.test(req.query.page) || !this.numRegex.test(req.query.limit))
                this.sendError(res, new Error('Request is invalid!'));
            else {
                let page = Number(req.query.page);
                let limit = Number(req.query.limit);

                if (page < 1 || limit < 1)
                    this.sendError(res, new Error('Request is invalid!'));
                else {
                    req.query.page = page;
                    req.query.limit = limit > maxRecords ? maxRecords : limit;

                    next();
                }
            }
        };
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
                            this.sendData(res, data);
                        }).catch(err => {
                            this.sendError(res, err);
                        });
                    else
                        this.sendData(res, handlerResult);
                }
            };
            return handlers;
        }
        else
            throw new Error('The router must have request handler function!');
    }

    sendData(res: express.Response, data: any) {
        if (process.env.NODE_ENV === 'Development')
            console.log(JSON.stringify(data));
        res.send({data});
    }

    sendError(res: express.Response, err: Error) {
        if (process.env.NODE_ENV === 'Development')
            console.error(err);
        res.status(400);
        res.send({error: {message: err.message}});
    }
}

export default BaseController;
