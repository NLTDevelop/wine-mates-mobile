import { IAppeal } from '@/entities/appeals/types/IAppeal';

export interface IAppealListItem {
    appeal: IAppeal;
    onPress: () => void;
}
