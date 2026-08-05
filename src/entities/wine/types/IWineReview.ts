import { ISnack } from '@/entities/snacks/types/ISnack';

export interface IWineReview {
    starRate?: number;
    rate?: number;
    review: string;
    isHidden?: boolean;
    hasChangedStarRate?: boolean;
    hasChangedRate?: boolean;
    aiTastingNote?: string | null;
    initialAiTastingNote?: string | null;
    hasEditedAiTastingNote?: boolean;
    aiSnacks?: ISnack[] | null;
}
