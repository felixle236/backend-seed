import * as mongoose from 'mongoose';

export default class DataHelper {
    static isObjectId(id: any): boolean {
        return id && id._bsontype === 'ObjectID';
    }

    static toObjectId(id: any): mongoose.Schema.Types.ObjectId {
        return typeof id === 'string' ? mongoose.Types.ObjectId.createFromHexString(id) : id;
    }

    static handleDataModel<T>(data: any, Type: {new(d: any): T}): string | T {
        if (!data)
            return '';
        if (DataHelper.isObjectId(data))
            return data.toString();
        if (Type)
            return new Type(data);
        return '';
    }

    static handleFileModel(file): string {
        if (file) {
            if (DataHelper.isObjectId(file))
                return file.toString();
            if (file.url)
                return file.url;
        }
        return file;
    }

    static filterDataInput<T>(entity: T, data: any, fields: string[]): T {
        for (let i = 0; i < fields.length; i++) {
            if (data.hasOwnProperty(fields[i]) && data[fields[i]] !== undefined)
                entity[fields[i]] = data[fields[i]];
        }
        return entity;
    }

    static applyTemplate(template: string, ...params): string {
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
