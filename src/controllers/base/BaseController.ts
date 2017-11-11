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
            if (!req.query.page || !this.numRegex.test(req.query.page) || Number(req.query.page) < 1)
                return this.sendError(res, new Error('Request is invalid!'));
            else
                req.query.page = Number(req.query.page);

            if (req.query.limit && (!this.numRegex.test(req.query.limit) || Number(req.query.limit) < 1))
                return this.sendError(res, new Error('Request is invalid!'));
            else if (req.query.limit) {
                req.query.limit = Number(req.query.limit);
                if (req.query.limit > maxRecords && maxRecords !== -1)
                    req.query.limit = maxRecords;
            }
            next();
        };
    }

    validateDateTime(...options: {}[]) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            for (let i = 0; i < options.length; i++) {
                let option = options[i];
                let field = Object.keys(option)[0];
                let type = option[field];

                if ((type === 'Y' || type === 'M' || type === 'D') && !this.numRegex.test(req.query[field]))
                    return this.sendError(res, new Error('Request is invalid!'));

                if (type === 'Y') {
                    let year = Number(req.query[field]);

                    if (year < 1970 || year > 9999)
                        return this.sendError(res, new Error('Request is invalid!'));

                    req.query[field] = year;
                    continue;
                }

                if (type === 'M') {
                    let month = Number(req.query[field]);

                    if (month < 1 || month > 12)
                        return this.sendError(res, new Error('Request is invalid!'));

                    req.query[field] = month;
                    continue;
                }

                if (type === 'D') {
                    let day = Number(req.query[field]);

                    if (day < 1 || day > 31)
                        return this.sendError(res, new Error('Request is invalid!'));

                    req.query[field] = day;
                    continue;
                }
            }
            next();
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
        console.log(JSON.stringify(data));
        res.send({data});
    }

    sendError(res: express.Response, err: Error) {
        console.error(err);
        res.status(400);
        res.send({error: {message: err.message}});
    }
}

export default BaseController;
