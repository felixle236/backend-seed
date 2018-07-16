interface IWrite<T> {
    create: (data: any) => Promise<T>;
    update: (id: string, data: any) => Promise<boolean>;
    delete: (id: string) => Promise<boolean>;
}

export default IWrite;
