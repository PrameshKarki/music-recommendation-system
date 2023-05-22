import { IPaginationConfig } from "./getPaginationConfig"

export const paginatedResponse = <T>(data: T[], total: number, paginationConfig: IPaginationConfig) => {
    return {
        data,
        pagination: {
            page: paginationConfig.page,
            perPage: paginationConfig.perPage,
            total,
            lastPage: Math.ceil(total / paginationConfig.perPage),
            nextPage: paginationConfig.page + 1 > Math.ceil(total / paginationConfig.perPage) ? null : paginationConfig.page + 1,
            prevPage: paginationConfig.page - 1 < 1 ? null : paginationConfig.page - 1
        }
    }

}