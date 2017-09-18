class Project {
    static DOMAIN: string = 'localhost';
    static PORT: number = 3000;
    static PROJECT_NAME: string = 'Backend seed';
    static EXPIRE_DAYS: number = 15;

    static DATABASE = {
        SERVER: 'localhost',
        DB_NAME: 'backend_seed',
        DB_NAME_TEST: 'backend_seed_test',
        USERNAME: '',
        PASSWORD: ''
    };

    static DB_CONN: string = `mongodb://${Project.DATABASE.SERVER}/${Project.DATABASE.DB_NAME}`;
    static DB_CONN_TEST: string = `mongodb://${Project.DATABASE.SERVER}/${Project.DATABASE.DB_NAME_TEST}`;

    static SMTP_SETTINGS = {
        AUTHENTICATOR: {
            USERNAME: '[Authenticator Email]',
            PASSWORD: '[Password]'
        },
        SENDER: {
            NAME: '[Sender Name]',
            EMAIL: '[Sender Email]'
        }
    };
}

Object.seal(Project);
export default Project;
