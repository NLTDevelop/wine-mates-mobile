import { AppealStatus } from '../enums/AppealStatus';

export interface IGetAppealsParams {
    page: number;
    limit: number;
    search?: string;
    status?: AppealStatus;
}
