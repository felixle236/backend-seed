import IConfiguration from './IConfiguration';
const envConfig = require(`./environments/${process.env.NODE_ENV}`).default;

export default {
    HOST: 'localhost',
    PORT: 3001,
    PORT_CACHING: 3111,
    PROJECT_NAME: 'Backend seed',
    EXPIRE_DAYS: 15,
    ...envConfig
} as IConfiguration;
