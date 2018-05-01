import * as express from 'express';
import {CronJob} from 'cron';
import BusinessLoader from '../system/BusinessLoader';
import CachingController from '../controllers/CachingController';

class DataCaching {
    static init(): express.Express {
        let cronRole = new CronJob({
            cronTime: '0 0 */1 * * *',
            onTick: async () => {
                await BusinessLoader.cachingBusiness.fetchDataRole();
            },
            runOnInit: true
        });
        cronRole.start();

        return express().use('/api/caching', new CachingController().getRouter());
    }
}

Object.seal(DataCaching);
export default DataCaching;
