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

    static applyTemplate(template, ...params) {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return params[number] || match;
        });
    }
}

Object.seal(DataHelper);
export default DataHelper;
