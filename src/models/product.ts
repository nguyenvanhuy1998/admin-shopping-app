import { File } from "./file";

export interface Product {
    id: string;
    price: string;
    files: File[];
    title: string;
    type: string;
    description: string;
    categories: string[];
    rate: number;
    createdAt: number;
}
