import * as mongoose from 'mongoose';
import IRead from '../interfaces/IRead'; // eslint-disable-line
import IWrite from '../interfaces/IWrite'; // eslint-disable-line
import Pagination from '../../model/common/Pagination';
import DataHelper from '../../../helpers/DataHelper';

class BaseRepository<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
    protected model: mongoose.Model<mongoose.Document>;

    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this.model = schemaModel;
    }

    protected validateParam(param?: any) {
        if (!param)
            param = {};
        if (!param.query)
            param.query = {};
        if (param.populate && typeof param.populate !== 'object')
            param.populate = null;
        param.query.deletedAt = null;

        return param;
    }

    async find(param?: any, order?: any, page?: number, limit?: number): Promise<T[]> {
        param = this.validateParam(param);
        let query = this.model.find(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        let pagination = new Pagination(page, limit);

        if (order)
            query = query.sort(order);

        query = query.skip(pagination.skip).limit(pagination.limit);
        return <T[]>(await query.exec());
    }

    async findAll(param?: any, order?: any): Promise<T[]> {
        param = this.validateParam(param);
        let query = this.model.find(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        if (order)
            query = query.sort(order);

        return <T[]>(await query.exec());
    }

    async findOne(param?: any): Promise<T | null> {
        param = this.validateParam(param);
        let query = this.model.findOne(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        return <T>(await query.exec());
    }

    async getCount(param?: any): Promise<number> {
        param = this.validateParam(param);
        return await this.model.find(param.query).count();
    }

    async get(_id: string, populate?: any): Promise<T | null> {
        if (populate && typeof populate !== 'object')
            populate = null;

        let query = this.model.findById(_id);

        if (populate)
            query = query.populate(populate);

        return <T>(await query.exec());
    }

    async create(data: object): Promise<T> {
        return <T>(await this.model.create(data));
    }

    async update(_id: string, data: object): Promise<T> {
        return <T>(await this.model.findOneAndUpdate({_id}, data, {new: true}).exec());
    }

    async delete(_id: string, isRealDelete: boolean = false): Promise<boolean> {
        if (!isRealDelete) {
            let result = await this.model.update({_id: DataHelper.toObjectId(_id)}, {deletedAt: new Date()}).exec();
            return result && result.ok > 0;
        }

        await this.model.remove({_id: DataHelper.toObjectId(_id)}).exec();
        return true;
    }
}

Object.seal(BaseRepository);
export default BaseRepository;
