import Pagination from './Pagination';

export default class ResultList<T> {
    pagination: Pagination;
    results: T[]

    constructor(page?: number, limit?: number) {
        this.pagination = new Pagination(page, limit);
        this.results = [];
    }
}
