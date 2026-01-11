export interface IBook {
    _id: string;
    title: string;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
}

export interface Pagination {
    currentPage: number;
    limit: number;
    numberOfPages: number;
}

export interface GetBooksResponse {
    status: string;
    code: number;
    message: string;
    results: number;
    pagination: Pagination;
    data: IBook[];
}

export interface GetBooksParams {
    page?: number;
    limit?: number;
    sort?: string;
    keyword?: string;
}
