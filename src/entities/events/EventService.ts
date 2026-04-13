import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IList } from '../IList';
import { IEvent, IEventDetail } from './types/IEvent';
import { IEventsListParams } from './params/IEventsListParams';
import { IEventMapPin } from './types/IEventMapPin';
import { IEventMapPinsParams } from './params/IEventMapPinsParams';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { eventsModel } from './EventsModel';

class EventService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    getList = async (params: IEventsListParams): Promise<IResponse<IList<IEvent>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.events}`,
                params,
            });

            if (!response.isError && response.data) {
                const items = response.data.items || response.data.rows || [];
                if (params.offset === 0) {
                    eventsModel.setEvents(items);
                } else {
                    const currentEvents = eventsModel.events;
                    eventsModel.setEvents([...currentEvents, ...items]);
                }
            }

            return response;
        } catch (error) {
            console.warn('EventService -> getList: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getById = async (id: number): Promise<IResponse<IEventDetail>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.events}/${id}`,
            });

            if (!response.isError) {
                eventsModel.setEventDetail(response.data);
            }

            return response;
        } catch (error) {
            console.warn('EventService -> getById: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    toggleSave = async (id: number): Promise<IResponse<{ isSaved: boolean }>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.events}/${id}/toggle-save`,
            });

            if (!response.isError) {
                const updatedEvents = eventsModel.events.map(event =>
                    event.id === id ? { ...event, isSaved: response.data.isSaved } : event
                );
                eventsModel.setEvents(updatedEvents);

                if (eventsModel.eventDetail?.id === id) {
                    eventsModel.setEventDetail({
                        ...eventsModel.eventDetail,
                        isSaved: response.data.isSaved,
                    });
                }
            }

            return response;
        } catch (error) {
            console.warn('EventService -> toggleSave: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    registerForEvent = async (id: number): Promise<IResponse<{ success: boolean }>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.events}/${id}/register`,
            });

            return response;
        } catch (error) {
            console.warn('EventService -> registerForEvent: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getMapPins = async (params: IEventMapPinsParams): Promise<IResponse<IEventMapPin[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.eventMapPins}`,
                params,
            });

            if (!response.isError && response.data) {
                eventsModel.setMapPins(Array.isArray(response.data) ? response.data : []);
            }

            return response;
        } catch (error) {
            console.warn('EventService -> getMapPins: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    createEvent = async (data: CreateEventDto): Promise<IResponse<IEventDetail>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.events}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('EventService -> createEvent: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const eventService = new EventService(requester, links);
