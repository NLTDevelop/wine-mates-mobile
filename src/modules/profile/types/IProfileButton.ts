import { ReactElement } from 'react';

export interface IProfileButton {
    id: number;
    text: string;
    icon: ReactElement;
    onPress: () => void;
    disabled?: boolean;
}
