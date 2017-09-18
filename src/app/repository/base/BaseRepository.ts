import * as mongoose from 'mongoose';
import IRead from '../interfaces/IRead'; // eslint-disable-line
import IWrite from '../interfaces/IWrite'; // eslint-disable-line
import Pagination from '../../model/common/Pagination';

class BaseRepository<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
    protected model: mongoose.Model<mongoose.Document>;

    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this.model = schemaModel;
    }

    async find(param?: any, order?: any, page?: number, limit?: number): Promise<T[]> {
        if (!param)
            param = {};
        param.deletedAt = null;

        let query = this.model.find(param);
        let pagination = new Pagination(page, limit);

        if (order)
            query = query.sort(order);

        query = query.skip(pagination.skip).limit(pagination.limit);

        return <T[]>(await query.exec());
    }

    async findAll(param?: any, order?: any): Promise<T[]> {
        if (!param)
            param = {};
        param.deletedAt = null;

        let query = this.model.find(param);

        if (order)
            query = query.sort(order);

        return <T[]>(await query.exec());
    }

    async findOne(param?: any): Promise<T | null> {
        if (!param)
            param = {};
        param.deletedAt = null;

        return <T>(await this.model.findOne(param).exec());
    }

    async getCount(param?: any): Promise<number> {
        if (!param)
            param = {};
        param.deletedAt = null;

        return await this.model.find(param).count();
    }

    async get(_id: string): Promise<T | null> {
        return <T>(await this.model.findById(_id).exec());
    }

    async create(data: object): Promise<T> {
        return <T>(await this.model.create(data));
    }

    async update(_id: string, data: object): Promise<boolean> {
        let result = await this.model.update({_id: this.toObjectId(_id)}, data).exec();
        return result && result.ok > 0;
    }

    async delete(_id: string, isRealDelete: boolean = false): Promise<boolean> {
        if (!isRealDelete) {
            let result = await this.model.update({_id: this.toObjectId(_id)}, {deletedAt: new Date()}).exec();
            return result && result.ok > 0;
        }

        await this.model.remove({_id: this.toObjectId(_id)}).exec();
        return true;
    }

    protected toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id && _id.toString());
    }
}

export default BaseRepository;
