import { File } from "./file";

export interface Product {
    id: string;
    price: string;
    files: string[];
    title: string;
    type: string;
    description: string;
    categories: string[];
    rate: number;
    createdAt: number;
}
