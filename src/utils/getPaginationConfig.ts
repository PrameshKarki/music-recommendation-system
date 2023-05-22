import { IFilter } from "../@types/pagination.interface";

export const DEFAULT_PAGE_SIZE = 30;
export const DEFAULT_PAGE = 1;

export interface IPaginationConfig {
    page: number;
    perPage: number;
    skip: number;
    take: number;
}

export const getPaginationConfig = (filter: IFilter): IPaginationConfig => {
    const page = filter?.page ? parseInt(filter.page) : DEFAULT_PAGE;
    const perPage = filter?.perPage ? parseInt(filter.perPage) : DEFAULT_PAGE_SIZE;
    return {
        page,
        perPage,
        skip: (Math.max(page, 1) - 1) * perPage,
        take: perPage
    }
}