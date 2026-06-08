import { ButtonType } from '@/UIKit/Button/types/ButtonType';

export interface IGuestAction {
    title: string;
    type: Extract<ButtonType, 'main' | 'secondary'>;
    onPress: () => void;
    inProgress: boolean;
}
