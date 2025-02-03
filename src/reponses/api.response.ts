import { Product } from "../models/product";

export interface ApiResponse {
  message: string;
  status: string;
  data: any;
}