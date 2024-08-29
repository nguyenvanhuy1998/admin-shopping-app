import { File } from "./file";

export interface Offer {
    id: string;
    code: string;
    title: string;
    startDate: number;
    endDate: number;
    files: File[];
    percent: string;
    updatedAt: number;
    createdAt: number;
    description: string;
}
