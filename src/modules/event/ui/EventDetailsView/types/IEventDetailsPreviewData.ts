import { IEventParticipantsPreviewData } from '@/modules/event/types/IEventParticipantPreviewData';

export interface IEventDetailsPreviewData {
    month: string;
    day: string;
    formattedDateTime: string;
    priceLabel: string;
    eventTypeLabel: string;
    isPartyEvent: boolean;
    mapPreviewUri: string;
    title: string;
    meetingPlaceName: string;
    locationLabel: string;
    latitude: number;
    longitude: number;
    tastingTypeLabel: string;
    participantsPreviewData: IEventParticipantsPreviewData;
}
