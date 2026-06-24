import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';

export type EventTastingDraftData = Partial<AddRateDto>;

export interface IEventTastingDraftResponse {
    data?: EventTastingDraftData;
}
