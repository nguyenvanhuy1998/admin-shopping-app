import { File } from "./product";

export interface Category {
    id: string;
    files?: any;
    title: string;
    createdAt: number;
    updatedAt: number;
}
