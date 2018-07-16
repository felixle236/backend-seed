
interface IConfiguration {
    HOST: string;
    PORT: number;
    PORT_CACHING: number;
    PROJECT_NAME: string;
    EXPIRE_DAYS: number;

    DATABASES: {
        NAME: string;
        HOST: string;
        PORT: number;
        DB_NAME: string;
        USERNAME: string;
        PASSWORD: string;
    }[];

    SMTP: {
        AUTHENTICATOR: {
            USERNAME: string;
            PASSWORD: string;
        };
        SENDER: {
            NAME: string;
            EMAIL: string;
        };
    };
}

export default IConfiguration;
