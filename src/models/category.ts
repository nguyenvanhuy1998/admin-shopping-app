import { File } from "./file";

export interface Category {
    id: string;
    files?: string[];
    title: string;
    createdAt: number;
    updatedAt: number;
}
