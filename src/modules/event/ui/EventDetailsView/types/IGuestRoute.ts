import { GuestTabs } from '../enums/GuestTabs';

export interface IGuestTabItem {
    value: GuestTabs;
    label: string;
    isActive: boolean;
    onPress: () => void;
}
