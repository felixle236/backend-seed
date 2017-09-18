interface IRead<T> {
    get: (_id: string) => Promise<T | null>;
}

export default IRead;
