import { IFAQQuestion } from './IFAQQuestion';

export interface IFAQListItem {
    id: number;
    name: string;
    questions: IFAQQuestion[];
    sortNumber: number | null;
}
