import { File } from "./offer";

export interface Category {
    id: string;
    files?: File[];
    title: string;
    createdAt: number;
    updatedAt: number;
}
