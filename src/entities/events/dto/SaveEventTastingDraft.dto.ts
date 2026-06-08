import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';

export interface SaveEventTastingDraftDto {
    eventId: number;
    wineId: number;
    data: Partial<AddRateDto>;
    isFinal: boolean;
}
