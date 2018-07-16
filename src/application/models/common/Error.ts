import {HttpError} from 'routing-controllers';
import MessageError from '../../../resources/data/MessageError';
import DataHelper from '../../../helpers/DataHelper';

export class ValidationError extends HttpError {
    public constructor(code: number, ...params) {
        super(400);
        if (code)
            this.message = MessageError['ERR_' + code];

        if (this.message)
            this.message = DataHelper.applyTemplate(this.message, ...params);
        else
            this.message = MessageError.ERR_001;

        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
