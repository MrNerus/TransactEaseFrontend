export enum StatusEnum {
    SUCCESS = 'SUCCESS',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR'
}

export interface ApiResponse<T> {
    message: string;
    status: StatusEnum | number; // Handling both enum and number as per user example (0 usually means success in some systems, but user provided enum definition too)
    data: T;
}

export interface PaginatedData<T> {
    totalPages: number;
    data: T[];
    totalItems?: number; // Optional as backend example didn't show it explicitly in the "data" object, but useful if available
}
