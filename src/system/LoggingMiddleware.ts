import {Request, Response, NextFunction} from 'express'; // eslint-disable-line
import {Middleware, ExpressMiddlewareInterface} from 'routing-controllers'; // eslint-disable-line

@Middleware({type: 'before'})
export class LoggingMiddleware implements ExpressMiddlewareInterface {
    public use(req: Request, res: Response, next: NextFunction): void {
        next();
    }
}
