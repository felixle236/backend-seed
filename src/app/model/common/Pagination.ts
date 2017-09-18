class Pagination {
    skip: number;
    limit: number;

    constructor(page?: number, limit?: number) {
        if (!page || isNaN(page))
            page = 1;
        if (!limit || isNaN(limit))
            limit = 10;

        this.limit = limit;
        this.skip = (page - 1) * limit;
    }
}

export default Pagination;
