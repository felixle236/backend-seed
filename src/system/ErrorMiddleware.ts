import {Request, Response, NextFunction} from 'express'; // eslint-disable-line
import {Middleware, ExpressErrorMiddlewareInterface} from 'routing-controllers'; // eslint-disable-line

@Middleware({type: 'after'})
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(err: Error, req: Request, res: Response, next: NextFunction) {
        next(err);
    }
}
