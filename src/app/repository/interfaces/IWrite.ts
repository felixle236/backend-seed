interface IWrite<T> {
    create: (data: any) => Promise<T>;
    update: (_id: string, data: any) => Promise<boolean>;
    delete: (_id: string) => Promise<boolean>;
}

export default IWrite;
