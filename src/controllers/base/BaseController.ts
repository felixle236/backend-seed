import * as express from 'express';
import {ErrorCommon, ErrorSystem} from '../../app/model/common/Error';
import DataHelper from '../../helpers/DataHelper';
import LogHelper from '../../helpers/LogHelper';

class BaseController {
    private router: express.Router;
    protected idRegex = /[0-9a-z]{24}/;
    protected targets = ['params', 'query', 'body'];
    protected types = ['ID', 'NUM', 'BOOL', 'DATE', 'Y', 'M', 'D'];

    constructor() {
        this.router = express.Router(); // eslint-disable-line
        this.router.param('_id', this.validateRegExp(this.idRegex));
    }

    getRouter() {
        return this.router;
    }

    validatePagination(maxRecords: number = 10) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (!req.query.page)
                req.query.page = 1;
            else if (isNaN(req.query.page) || Number(req.query.page) < 1)
                return this.sendError(req, res, new ErrorCommon(101, 'Request'));
            else
                req.query.page = Number(req.query.page);

            if (!req.query.limit)
                req.query.limit = maxRecords;
            else if (isNaN(req.query.limit) || Number(req.query.limit) < 1)
                return this.sendError(req, res, new ErrorCommon(101, 'Request'));
            else {
                req.query.limit = Number(req.query.limit);
                if (req.query.limit > maxRecords || req.query.limit < 1)
                    req.query.limit = maxRecords;
            }
            next();
        };
    }

    validateData(...options: {target?: string, required?: boolean, field: string, type: string}[]) {
        let getValue = (data, field) => {
            if (!data || !field)
                return;
            return field.split('.').reduce((a, b) => a[b], data);
        };
        let setValue = (data, field, value) => {
            if (!data || !field)
                return;
            let arr = field.split('.');
            while (arr.length > 1 && (data = data[arr.shift()]));
            if (data)
                data[arr.shift()] = value;
        };

        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            for (let i = 0; i < options.length; i++) {
                let option = options[i];
                let target = option.target || (['GET', 'DELETE'].includes(req.method) ? 'query' : 'body');
                let required = option.required;
                let field = option.field;
                let data = req[target];
                let value = getValue(data, field);
                let type = option.type;

                if (!this.targets.includes(target) || !this.types.includes(type) || !field || (required && !value && value !== false)) {
                    console.log(`Validate ${target} ${field} ${type}${required ? ' Required' : ''}: ${JSON.stringify(value)} (${typeof value})`);
                    return this.sendError(req, res, new ErrorCommon(101, (field || 'Data') + ' format'));
                }

                if (!required && !value) {
                    setValue(data, field, undefined);
                    continue;
                }
                else if (type === 'ID' && !this.idRegex.test(value)) {
                    console.log(`Validate ${target} ${field} ${type}${required ? ' Required' : ''}: ${JSON.stringify(value)} (${typeof value})`);
                    return this.sendError(req, res, new ErrorCommon(101, 'Request'));
                }
                else if (['NUM'].includes(type)) {
                    if (isNaN(value)) {
                        console.log(`Validate ${target} ${field} ${type}${required ? ' Required' : ''}: ${JSON.stringify(value)} (${typeof value})`);
                        return this.sendError(req, res, new ErrorCommon(101, 'Request'));
                    }

                    setValue(data, field, Number(value));
                    continue;
                }
                else if (['BOOL'].includes(type)) {
                    setValue(data, field, DataHelper.convertStringToBoolean(value));
                    continue;
                }
                else if (type === 'DATE') {
                    let date: any = new Date(value);

                    if (date === 'Invalid Date' || isNaN(date)) {
                        console.log(`Validate ${target} ${field} ${type}${required ? ' Required' : ''}: ${JSON.stringify(value)} (${typeof value})`);
                        return this.sendError(req, res, new ErrorCommon(101, 'Request'));
                    }

                    setValue(data, field, date);
                    continue;
                }
                else if (['Y', 'M', 'D'].includes(type)) {
                    if (isNaN(value)) {
                        console.log(`Validate ${target} ${field} ${type}${required ? ' Required' : ''}: ${JSON.stringify(value)} (${typeof value})`);
                        return this.sendError(req, res, new ErrorCommon(101, 'Request'));
                    }

                    if (type === 'Y') {
                        let year = Number(value);

                        if (year < 1970 || year > 9999) {
                            console.log(`Validate ${target} ${field} ${type}${required ? ' Required' : ''}: ${JSON.stringify(value)} (${typeof value})`);
                            return this.sendError(req, res, new ErrorCommon(101, 'Request'));
                        }

                        setValue(data, field, year);
                        continue;
                    }
                    else if (type === 'M') {
                        let month = Number(value);

                        if (month < 1 || month > 12) {
                            console.log(`Validate ${target} ${field} ${type}${required ? ' Required' : ''}: ${JSON.stringify(value)} (${typeof value})`);
                            return this.sendError(req, res, new ErrorCommon(101, 'Request'));
                        }

                        setValue(data, field, month);
                        continue;
                    }
                    else if (type === 'D') {
                        let day = Number(value);

                        if (day < 1 || day > 31) {
                            console.log(`Validate ${target} ${field} ${type}${required ? ' Required' : ''}: ${JSON.stringify(value)} (${typeof value})`);
                            return this.sendError(req, res, new ErrorCommon(101, 'Request'));
                        }

                        setValue(data, field, day);
                        continue;
                    }
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

    protected patch(path: string, ...handlers: express.RequestHandler[]): void {
        this.router.patch(path, this.handleRequest(handlers));
    }

    protected delete(path: string, ...handlers: express.RequestHandler[]): void {
        this.router.delete(path, this.handleRequest(handlers));
    }

    private handleRequest(handlers: express.RequestHandler[]): express.RequestHandler[] {
        if (handlers.length > 0) {
            let handler = handlers[handlers.length - 1];

            handlers[handlers.length - 1] = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                let handlerResult = handler(req, res, next);
                if (handlerResult && typeof handlerResult['then'] === 'function')
                    handlerResult.then(data => {
                        this.sendData(req, res, data);
                    }).catch(err => {
                        this.sendError(req, res, err);
                    });
                else
                    this.sendData(req, res, handlerResult);
            };
            return handlers;
        }
        else
            throw new ErrorCommon(2);
    }

    sendData(req: express.Request, res: express.Response, data: any) {
        console.log('\n+ Request:');
        console.log('  • Query:', '\x1b[35m', req.query, '\x1b[0m');
        console.log('  • Body:', '\x1b[35m', req.body, '\x1b[0m');
        console.log('+ Response:', '\x1b[36m', data, '\x1b[0m');

        if (!res.headersSent)
            res.send({data});
    }

    sendError(req: express.Request, res: express.Response, err) {
        err = err.code ? err : new ErrorSystem(err.message);
        console.log('\n+ Request:');
        console.log('  • Query:', '\x1b[35m', req.query, '\x1b[0m');
        console.log('  • Body:', '\x1b[35m', req.body, '\x1b[0m');
        console.log('+ Error:', '\x1b[31m', err, '\x1b[0m');

        if (err.code && !err.code.startsWith('COM'))
            LogHelper.writeLog(`${req.method} ${req.originalUrl}\n${err.message}\n`);

        if (!res.headersSent) {
            res.status(400);
            res.send({error: err});
        }
    }
}

export default BaseController;
