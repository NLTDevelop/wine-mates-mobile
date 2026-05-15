import { IEventParticipant } from '@/entities/events/types/IEventParticipant';
import { localization } from '@/UIProvider/localization/Localization';
import {
    IEventParticipantPreviewItem,
    IEventParticipantsPreviewData,
} from '@/modules/event/types/IEventParticipantPreviewData';

const MAX_VISIBLE_PARTICIPANTS = 3;

const getFullName = (participant: IEventParticipant) => {
    return `${participant.firstName} ${participant.lastName}`;
};

const getAvatarUrl = (participant: IEventParticipant) => {
    return participant.avatar?.smallUrl || participant.avatar?.mediumUrl || participant.avatar?.originalUrl || null;
};

const getParticipant = (participant?: IEventParticipant): IEventParticipantPreviewItem | null => {
    if (!participant) {
        return null;
    }

    return {
        id: participant.id,
        fullName: getFullName(participant),
        avatarUrl: getAvatarUrl(participant),
    };
};

export const prepareEventParticipantsPreview = (
    participants?: IEventParticipant[] | null,
): IEventParticipantsPreviewData => {
    const visibleParticipants = participants?.slice(0, MAX_VISIBLE_PARTICIPANTS) || [];
    const additionalCount = Math.max(0, (participants?.length || 0) - MAX_VISIBLE_PARTICIPANTS);

    return {
        firstParticipant: getParticipant(visibleParticipants[0]),
        secondParticipant: getParticipant(visibleParticipants[1]),
        thirdParticipant: getParticipant(visibleParticipants[2]),
        additionalCountText: additionalCount ? `+${additionalCount} ${localization.t('event.interesting')}` : '',
        isNeedShow: visibleParticipants.length > 0,
    };
};
