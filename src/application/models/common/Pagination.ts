export default class Pagination {
    public page: number;
    public limit: number;
    public total: number;

    public constructor(page?: number, limit?: number) {
        if (!page || isNaN(page))
            page = 1;
        if (!limit || isNaN(limit))
            limit = 10;

        this.page = page;
        this.limit = limit;
        this.total = 0;
    }

    public skip(): number {
        return (this.page - 1) * this.limit;
    }
}
