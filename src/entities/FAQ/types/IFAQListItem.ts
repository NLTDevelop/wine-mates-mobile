import { IFAQQuestion } from './IFAQQuestion';

export interface IFAQListItem {
    id: number;
    topicName: string;
    questions: IFAQQuestion[];
}
