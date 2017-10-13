import * as mongoose from 'mongoose';

export default class DataHelper {
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
}
