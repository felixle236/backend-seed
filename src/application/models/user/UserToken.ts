import {LoginProvider} from '../common/CommonType';

export default class UserToken {
    provider: LoginProvider;
    providerName: string;
    accessToken: string;
    tokenExpire: Date;

    constructor(model: UserToken | undefined) {
        if (!model)
            return;

        this.provider = model.provider || LoginProvider.System;
        this.providerName = model.providerName || LoginProvider[this.provider];
        this.accessToken = model.accessToken;
        this.tokenExpire = model.tokenExpire;
    }
}
