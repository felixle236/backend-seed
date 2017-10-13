import * as _ from 'lodash';

interface IProject {
    DOMAIN: string;
    PORT: number;
    PROJECT_NAME: string;
    EXPIRE_DAYS: number;

    DATABASE: {
        SERVER: string,
        DB_NAME: string,
        DB_NAME_TEST: string,
        USERNAME: string,
        PASSWORD: string
    };

    DB_CONN_URI: string;
    DB_CONN_URI_TEST: string;

    SMTP: {
        AUTHENTICATOR: {
            USERNAME: string,
            PASSWORD: string
        },
        SENDER: {
            NAME: string,
            EMAIL: string
        }
    };
}

class Project {
    static initGlobalConfig() {
        // Get the default config
        let defaultConfig = require('./env/Default');

        // Get the current config
        let environmentConfig = require(`./env/${(process as any).env.NODE_ENV}`);

        // Merge config files
        let config = _.merge(defaultConfig.default, environmentConfig.default);
        return config;
    }
}

Object.seal(Project);
export default <IProject>Project.initGlobalConfig();
