import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { SaveEventTastingDraftDto } from './dto/SaveEventTastingDraft.dto';
import { IEventTastingDraftResponse } from './types/IEventTastingDraft';

class EventTastingService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    getDraft = async (params: { eventId: number; wineId: number }): Promise<IResponse<IEventTastingDraftResponse>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.eventTastingDraft}`,
                params,
            });

            return response;
        } catch (error) {
            console.warn('EventTastingService -> getDraft: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    saveDraft = async (data: SaveEventTastingDraftDto): Promise<IResponse<{}>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.eventTastingSaveDraft}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('EventTastingService -> saveDraft: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const eventTastingService = new EventTastingService(requester, links);
