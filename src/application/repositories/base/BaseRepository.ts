import * as mongoose from 'mongoose';
import IRead from '../interfaces/IRead'; // eslint-disable-line
import IWrite from '../interfaces/IWrite'; // eslint-disable-line
import Pagination from '../../models/common/Pagination';
import DataHelper from '../../../helpers/DataHelper';

export default class BaseRepository<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
    protected model: mongoose.Model<mongoose.Document>;

    public constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this.model = schemaModel;
    }

    protected validateParam(param?: any) {
        if (!param)
            param = {};
        if (!param.query)
            param.query = {};

        return param;
    }

    public async find(param?: any): Promise<T[]> {
        param = this.validateParam(param);
        let query = this.model.find(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        if (param.order)
            query = query.sort(param.order);

        let pagination = new Pagination(param.page, param.limit);
        query = query.skip(pagination.skip()).limit(pagination.limit);

        return await query.exec() as T[];
    }

    public async findAll(param?: any): Promise<T[]> {
        param = this.validateParam(param);
        let query = this.model.find(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        if (param.order)
            query = query.sort(param.order);

        return await query.exec() as T[];
    }

    public async findOne(param?: any): Promise<T | undefined> {
        param = this.validateParam(param);
        let query = this.model.findOne(param.query);

        if (param.select)
            query = query.select(param.select);

        if (param.populate)
            query = query.populate(param.populate);

        return await query.exec() as T;
    }

    public count(param?: any): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            param = this.validateParam(param);
            this.model.count(param.query, (err, count) => {
                if (err) return reject(err);
                resolve(count);
            });
        });
    }

    public async get(id: string | mongoose.Schema.Types.ObjectId, populate?: any): Promise<T | undefined> {
        let query = this.model.findById(id);

        if (populate)
            query = query.populate(populate);

        return await query.exec() as T;
    }

    public aggregate(query: any): Promise<any[]> {
        return this.model.aggregate(query).exec();
    }

    public async create(data: any): Promise<T> {
        return await this.model.create(data) as T;
    }

    public async createMultiple(data: any[]): Promise<T[]> {
        return await this.model.create(data) as T[];
    }

    public async createOrUpdate(query: any, data: any): Promise<T | undefined> {
        let options = {upsert: true, new: true, setDefaultsOnInsert: true};
        return await this.model.findOneAndUpdate(query, data, options).exec() as T;
    }

    public async update(id: string | mongoose.Schema.Types.ObjectId, data: any): Promise<boolean> {
        let result = await this.model.update({_id: DataHelper.toObjectId(id)}, data).exec();
        return result && result.ok > 0;
    }

    public async findOneAndUpdate(query: any, data: any): Promise<T | undefined> {
        return await this.model.findOneAndUpdate(query, data, {new: true}).exec() as T;
    }

    public async updateDataByFields(id: string | mongoose.Schema.Types.ObjectId, data: any, parentField?: string): Promise<void> {
        if (id && data) {
            for (let field in data) {
                if (data.hasOwnProperty(field)) {
                    let prop = parentField ? parentField + '.' + field : field;
                    let dataUpdate = {};
                    dataUpdate[prop] = data[field];
                    await this.update(id, dataUpdate);
                }
            }
        }
    }

    public async delete(id: string | mongoose.Schema.Types.ObjectId, isRealDelete: boolean = false): Promise<boolean> {
        if (!isRealDelete) {
            let result = await this.model.update({_id: DataHelper.toObjectId(id)}, {deletedAt: new Date()}).exec();
            return result && result.ok > 0;
        }
        await this.model.remove({_id: DataHelper.toObjectId(id)}).exec();
        return true;
    }
}
