import { IProduct } from "./product";

export interface IPagination {
    pageIndex: number;
    pageSize: number;
    itemParamCount: number;
    totalPages: number;
    totalItems:number;
    data: IProduct[];
}

