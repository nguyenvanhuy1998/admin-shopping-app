export interface Offer {
    id: string;
    code: string;
    title: string;
    description?: string;
    percent: string;
    files?: any;
    startDate: string | number;
    endDate: string | number;
}
