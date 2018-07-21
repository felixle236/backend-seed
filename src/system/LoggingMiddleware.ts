import {Request, Response, NextFunction} from 'express'; // eslint-disable-line
import {Middleware, ExpressMiddlewareInterface} from 'routing-controllers'; // eslint-disable-line

@Middleware({type: 'before'})
export class LoggingMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, res: Response, next: NextFunction): void {
        next();
    }
}
