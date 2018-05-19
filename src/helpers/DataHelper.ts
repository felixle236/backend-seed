import * as mongoose from 'mongoose';
import {ErrorSystem, ErrorCommon} from '../app/model/common/Error';

class DataHelper {
    static toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id && _id.toString());
    }

    static handleDataModelInput(dataInput): void {
        Object.keys(dataInput).forEach(key => {
            if (dataInput[key] === undefined)
                delete dataInput[key];
            else if (dataInput[key] === null || dataInput[key] === 'null')
                dataInput[key] = undefined;
        });
    }

    static handleIdDataModel(data) {
        return data && data._bsontype === 'ObjectID' ? data.toString() : data;
    }

    static handleFileDataModel(file) {
        if (file) {
            if (file.url)
                return file.url;
            return file.toString();
        }
        return undefined;
    }

    static handlePromiseRequest(promise): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            promise.then(({data, error}) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            }).catch(error => {
                if (error.name === 'RequestError')
                    reject(new ErrorCommon(10));
                else
                    reject(new ErrorSystem(error.message));
            });
        });
    }

    static applyTemplate(template, ...params) {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return params[number] || match;
        });
    }

    static convertToCurrency(value: number, option): string {
        if (typeof value !== 'number')
            return '';

        if (!option)
            option = {};
        if (!option.format)
            option.format = 'en-US';
        if (!option.currency)
            option.currency = 'USD';

        return value.toLocaleString(option.format, {style: 'currency', currency: option.currency});
    }

    static convertStringToBoolean(val: string): boolean {
        if (!val)
            return false;
        val = val.toString();

        switch (val.toLowerCase().trim()) {
        case 'true': case 'yes': case '1': return true;
        case 'false': case 'no': case '0': return false;
        default: return false;
        }
    }
}

Object.seal(DataHelper);
export default DataHelper;
