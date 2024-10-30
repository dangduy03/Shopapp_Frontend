import { Product } from "../models/product";

export interface ApiResponse {
    message: string;
    status: string;
    data: any;
    // data: {
    //     products: Product[];
    //     totalPages: number;
    //   };
}