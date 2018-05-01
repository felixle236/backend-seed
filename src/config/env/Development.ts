class Development {
    static DATABASES = [{
        NAME: 'default',
        HOST: 'localhost',
        PORT: 27017,
        DB_NAME: 'backend_seed_development',
        USERNAME: '',
        PASSWORD: ''
    }, {
        NAME: 'test',
        HOST: 'localhost',
        PORT: 27017,
        DB_NAME: 'backend_seed_test',
        USERNAME: '',
        PASSWORD: ''
    }];

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

export default Development;
