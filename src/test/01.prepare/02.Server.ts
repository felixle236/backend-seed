import 'mocha';
import {Container} from 'typedi';
import * as routing from 'routing-controllers';
import * as validator from 'class-validator';
import config from '../../configuration';
import createHttpServer from '../../system/Server';

routing.useContainer(Container);
validator.useContainer(Container);

before(done => {
    createHttpServer(config.PORT_CACHING);
    createHttpServer(config.PORT);

    done();
});

after(done => {
    done();
});
