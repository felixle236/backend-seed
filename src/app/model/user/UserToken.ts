import IUser from '../../model/user/interfaces/IUser'; // eslint-disable-line
import {LoginProvider} from '../common/CommonType';

class UserToken {
    provider: LoginProvider;
    providerName: string;
    accessToken: string;
    tokenExpire: Date;

    constructor(model: UserToken) {
        if (!model)
            return;

        this.provider = model.provider || LoginProvider.Local;
        this.providerName = model.providerName || LoginProvider[this.provider];
        this.accessToken = model.accessToken;
        this.tokenExpire = model.tokenExpire;
    }
}

export default UserToken;
