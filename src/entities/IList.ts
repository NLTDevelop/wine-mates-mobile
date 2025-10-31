export interface IList<T> {
    data: T[];
    meta: {
        total: number;
        limit: number;
        offset: number;
    }
}