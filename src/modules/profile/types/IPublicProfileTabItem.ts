import { PublicProfileTab } from '@/modules/profile/enums/PublicProfileTab';

export interface IPublicProfileTabItem {
    key: PublicProfileTab;
    title: string;
    isSelected: boolean;
    isDisabled: boolean;
    onPress: () => void;
}
