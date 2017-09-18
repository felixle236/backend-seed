interface IRead<T> {
    find: (param?: any, order?: any, page?: number, limit?: number) => Promise<T[]>;
    findAll: (param?: any, order?: any) => Promise<T[]>;
    findOne: (param?: any) => Promise<T | null>;
    getCount: (param?: any) => Promise<number>;
    get: (_id: string) => Promise<T | null>;
}

export default IRead;
