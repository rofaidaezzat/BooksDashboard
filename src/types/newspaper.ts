export interface INewspaper {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    slug?: string;
}

export interface Pagination {
    currentPage: number;
    limit: number;
    numberOfPages: number;
}

export interface GetNewspapersResponse {
    status: string;
    code: number;
    message: string;
    results: number;
    pagination: Pagination;
    data: INewspaper[];
}

export interface GetNewspapersParams {
    page?: number;
    limit?: number;
    sort?: string;
    keyword?: string;
}
