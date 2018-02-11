import * as mongoose from 'mongoose';

class DataHelper {
    static toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id && _id.toString());
    }

    static handleDataModelInput(dataInput): void {
        Object.keys(dataInput).forEach(key => {
            if (dataInput[key] === undefined)
                delete dataInput[key];
            else if (dataInput[key] == null || dataInput[key] === 'null')
                dataInput[key] = undefined;
        });
    }

    static handleIdDataModel(data) {
        return data && !data._id ? data.toString() : data;
    }

    static handleFileDataModel(file) {
        if (file) {
            if (file.url)
                return file.url;
            return file.toString();
        }
        return undefined;
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

    static applyTemplate(template, ...params) {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return params[number] || match;
        });
    }
}

Object.seal(DataHelper);
export default DataHelper;
