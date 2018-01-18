import BaseController from './base/BaseController';
import InitialData from '../system/InitialData';

class SystemController extends BaseController {
    constructor() {
        super();

        if (process.env.NODE_ENV !== 'Production')
            this.post('/init-data', this.initData.bind(this));
    }

    async initData(req): Promise<any> {
        await (new InitialData()).init(true);
        return true;
    }
}

Object.seal(SystemController);
export default SystemController;
