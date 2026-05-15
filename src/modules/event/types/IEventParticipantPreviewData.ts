export interface IEventParticipantPreviewItem {
    id: number;
    fullName: string;
    avatarUrl: string | null;
}

export interface IEventParticipantsPreviewData {
    firstParticipant: IEventParticipantPreviewItem | null;
    secondParticipant: IEventParticipantPreviewItem | null;
    thirdParticipant: IEventParticipantPreviewItem | null;
    additionalCountText: string;
    isNeedShow: boolean;
}
