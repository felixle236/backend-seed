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
        if (param.query.deletedAt === undefined)
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
        return <T[]>(await query.exec().then(docs => docs.map(doc => doc.toJSON())));
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

        return <T[]>(await query.exec().then(docs => docs.map(doc => doc.toJSON())));
    }

    async findOne(param?: any): Promise<T | null> {
        param = this.validateParam(param);
        let query = this.model.findOne(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        return <T>(await query.exec().then(doc => doc ? doc.toJSON() : null));
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

        return <T>(await query.exec().then(doc => doc ? doc.toJSON() : null));
    }

    async aggregate(query: any): Promise<any[]> {
        return await this.model.aggregate(query).exec();
    }

    async create(data: any): Promise<T> {
        return <T>(await this.model.create(data).then(doc => doc ? doc.toJSON() : null));
    }

    async createMultiple(data: any[]): Promise<T[]> {
        return <T[]>(await this.model.create(data).then(docs => docs.map(doc => doc.toJSON())));
    }

    async createOrUpdate(query: any, data: any): Promise<T | null> {
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        return <T>(await this.model.findOneAndUpdate(query, data, options).exec().then(doc => doc ? doc.toJSON() : null));
    }

    async update(_id: string, data: any): Promise<boolean> {
        let result = await this.model.update({_id: DataHelper.toObjectId(_id)}, data).exec();
        return result && result.ok > 0;
    }

    async findOneAndUpdate(query: any, data: any): Promise<T | null> {
        return <T>(await this.model.findOneAndUpdate(query, data, {new: true}).exec().then(doc => doc ? doc.toJSON() : null));
    }

    async updateDataByFields(_id: string, data: any, parentField?: string): Promise<void> {
        if (_id && data) {
            for (let field in data) {
                if (data.hasOwnProperty(field)) {
                    let prop = parentField ? parentField + '.' + field : field;
                    let dataUpdate = {};
                    dataUpdate[prop] = data[field];
                    await this.update(_id, dataUpdate);
                }
            }
        }
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

export default BaseRepository;
