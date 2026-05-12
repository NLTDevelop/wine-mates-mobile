import { IGuestAction } from './IGuestAction';

export interface IPreparedEventGuest {
    id: number;
    fullName: string;
    ageText: string;
    avatarUrl: string | null;
    primaryAction?: IGuestAction;
    secondaryAction?: IGuestAction;
}
