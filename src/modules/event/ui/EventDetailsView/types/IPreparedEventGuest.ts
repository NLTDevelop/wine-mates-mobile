import { IGuestAction } from './IGuestAction';

export interface IPreparedEventGuest {
    id: number;
    fullName: string;
    ageText: string;
    avatarUrl: string | null;
    onUserPress: () => void;
    primaryAction?: IGuestAction;
    secondaryAction?: IGuestAction;
}
