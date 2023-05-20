import { IPagination } from "../@types/pagination.interface";

export const DEFAULT_PAGE_SIZE = 30;
export const DEFAULT_PAGE = 1;

export interface IPaginationConfig {
    page: number;
    perPage: number;
    skip: number;
    take: number;
}

export const getPaginationConfig = (pagination: IPagination): IPaginationConfig => {
    const page = pagination.page ? parseInt(pagination.page) : DEFAULT_PAGE;
    const perPage = pagination.perPage ? parseInt(pagination.perPage) : DEFAULT_PAGE_SIZE;
    return {
        page,
        perPage,
        skip: (Math.max(page, 1) - 1) * perPage,
        take: perPage
    }
}