import * as express from 'express';
import {sealed} from '../helpers/InjectionHelper'; // eslint-disable-line
import HomeController from '../controllers/HomeController';
import UserController from '../controllers/UserController';
import RoleController from '../controllers/RoleController';

@sealed
class RouteLoader {
    private app: express.Express = express();

    constructor() {
        this.app.use('/api/', new HomeController().getRouter());
        this.app.use('/api/user', new UserController().getRouter());
        this.app.use('/api/role', new RoleController().getRouter());
    }

    getRouters() {
        return this.app;
    }
}

export default RouteLoader;
