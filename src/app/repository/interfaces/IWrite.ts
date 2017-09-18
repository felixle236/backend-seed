interface IWrite<T> {
    create: (data: object) => Promise<T>;
    update: (_id: string, data: object) => Promise<boolean>;
    delete: (_id: string) => Promise<boolean>;
}

export default IWrite;
