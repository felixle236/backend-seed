import {LoginProvider} from '../common/CommonType';

export default class UserToken {
    public provider: LoginProvider;
    public providerName: string;
    public accessToken: string;
    public tokenExpire: Date;

    public constructor(model: UserToken | undefined) {
        if (!model)
            return;

        this.provider = model.provider || LoginProvider.System;
        this.providerName = model.providerName || LoginProvider[this.provider];
        this.accessToken = model.accessToken;
        this.tokenExpire = model.tokenExpire;
    }
}
