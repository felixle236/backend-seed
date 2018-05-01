interface IRead<T> {
    find: (param?: any, order?: any, page?: number, limit?: number) => Promise<T[]>;
    findOne: (param?: any) => Promise<T | undefined>;
    count: (param?: any) => Promise<number>;
    get: (_id: string) => Promise<T | undefined>;
}

export default IRead;
