interface IRead<T> {
    get(_id: string): Promise<T | undefined>;
}

export default IRead;
