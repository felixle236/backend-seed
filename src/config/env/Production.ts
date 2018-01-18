class Production {
    static DATABASE = {
        SERVER: 'localhost',
        DB_NAME: 'backend_seed_production',
        DB_NAME_TEST: 'backend_seed_test',
        USERNAME: '',
        PASSWORD: ''
    };

    static DB_CONN_URI: string = `mongodb://${Production.DATABASE.SERVER}/${Production.DATABASE.DB_NAME}`;
    static DB_CONN_URI_TEST: string = `mongodb://${Production.DATABASE.SERVER}/${Production.DATABASE.DB_NAME_TEST}`;

    static SMTP = {
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

export default Production;
