export interface Offer {
    id: string;
    code: string;
    title: string;
    description?: string;
    percent: string;
    files?: File[];
    startAt: string;
    endAt: string;
}

export interface File {
    path: string;
    url: string;
    updateAt: number;
}
