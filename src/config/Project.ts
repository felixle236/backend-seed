import Default from './env/Default';

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
    static getConfiguration() {
        // Get the current config
        let envConfig = require(`./env/${process.env.NODE_ENV}`);
        let config = {
            ...Default,
            ...envConfig.default
        };
        return config;
    }
}

Object.seal(Project);
export default <IProject>Project.getConfiguration();
