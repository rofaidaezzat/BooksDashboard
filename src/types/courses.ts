export interface ICourse {
    _id: string;
    name: string;
    title: string;
    type: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    next?: number;
}

export interface GetCoursesResponse {
    results: number;
    pagination: Pagination;
    data: ICourse[];
}

export interface GetCoursesParams {
    page?: number;
    limit?: number;
    sort?: string;
    keyword?: string;
}
