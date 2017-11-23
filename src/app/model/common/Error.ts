import DataHelper from '../../../helpers/DataHelper';
import ErrorCommonData from '../../../resources/errors/ErrorCommonData';

export class BaseError {
    code: string;
    message?: string;

    constructor(prefix?: string, codeNum?: number, message?: string) {
        this.code = '';
        if (prefix)
            this.code = prefix;
        if (codeNum)
            this.code += codeNum.toString().padStart(3, '0');
        if (message)
            this.message = message;
    }

    applyParams(...params) {
        if (this.message && params && params.length > 0)
            this.message = DataHelper.applyTemplate(this.message, params);
    }
};

export class ErrorSystem extends BaseError {
    constructor(message?: string) {
        super('SYS', undefined, message);
    }
};

export class ErrorCommon extends BaseError {
    constructor(codeNum: number, ...params) {
        super('COM', codeNum);
        this.message = ErrorCommonData[this.code];
        this.applyParams(params);
    }
};
