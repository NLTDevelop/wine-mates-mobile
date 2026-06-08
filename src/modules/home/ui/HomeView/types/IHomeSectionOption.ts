import { HomeSectionKey } from '@/entities/homeSections/types/HomeSectionKey';

export interface IHomeSectionOption {
    key: HomeSectionKey;
    title: string;
    description: string;
    isSelected: boolean;
    onPress: () => void;
}
