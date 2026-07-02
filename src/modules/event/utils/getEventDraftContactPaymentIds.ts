import { IEventContact } from '@/entities/events/types/IEvent';

interface IEventPaymentMethodSource {
    id?: number;
    isVisible?: boolean;
}

interface IEventDraftContactPaymentSource {
    contacts?: IEventContact[];
    paymentMethods?: IEventPaymentMethodSource[];
}

export const getEventDraftPaymentMethodIds = (eventDetail: IEventDraftContactPaymentSource) => {
    if (!eventDetail.paymentMethods?.length) {
        return [];
    }

    return eventDetail.paymentMethods
        .filter(item => item.isVisible !== false)
        .map(item => Number(item.id || 0))
        .filter(id => id > 0);
};

export const getEventDraftContactIds = (eventDetail: IEventDraftContactPaymentSource) => {
    if (!eventDetail.contacts?.length) {
        return [];
    }

    return eventDetail.contacts
        .filter(item => item.isVisible !== false)
        .map(item => Number(item.contactId || item.id || 0))
        .filter(id => id > 0);
};
