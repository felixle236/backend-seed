import LoginProvider from './enums/LoginProvider';

class UserToken {
    provider: LoginProvider;
    providerName: string;
    accessToken: string;
    tokenExpire: Date;

    constructor(provider: LoginProvider = LoginProvider.Local) {
        this.provider = provider;
        this.providerName = LoginProvider[provider];
    }
}

export default UserToken;
