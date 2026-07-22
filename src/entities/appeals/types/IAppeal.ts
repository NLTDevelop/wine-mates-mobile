import { AppealStatus } from '../enums/AppealStatus';
import { IAppealFile } from './IAppealFile';
import { IAppealPhoto } from './IAppealPhoto';

export interface IAppeal {
    id: number;
    subject: string;
    description: string | null;
    status: AppealStatus;
    adminComment: string | null;
    closedAt: string | null;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    photos: IAppealPhoto[];
    files: IAppealFile[];
}
