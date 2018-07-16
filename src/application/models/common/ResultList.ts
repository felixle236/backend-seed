import Pagination from './Pagination';

export default class ResultList<T> {
    public pagination: Pagination;
    public results: T[]

    public constructor(page?: number, limit?: number) {
        this.pagination = new Pagination(page, limit);
        this.results = [];
    }
}
