import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IList } from '../IList';
import { IEvent, IEventDetail } from './types/IEvent';
import { IEventsListParams } from './params/IEventsListParams';
import { IEventMapPin } from './types/IEventMapPin';
import { IEventMapPinsParams } from './params/IEventMapPinsParams';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { eventsModel } from './EventsModel';
import { userModel } from '../users/UserModel';
import countries from 'world-countries';

class EventService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    private getCountryHeaderValue = () => {
        const rawCountry = userModel.user?.country?.trim();
        if (!rawCountry) {
            return '';
        }

        const normalizedCountryCode = rawCountry.toUpperCase();
        const country = countries.find(
            item =>
                item.cca2?.toUpperCase() === normalizedCountryCode ||
                item.cca3?.toUpperCase() === normalizedCountryCode,
        );

        if (country?.name?.common) {
            return country.name.common;
        }

        try {
            const regionName = new Intl.DisplayNames(['en'], { type: 'region' }).of(normalizedCountryCode);
            if (regionName && regionName !== normalizedCountryCode) {
                return regionName;
            }
        } catch {
            return rawCountry;
        }

        return rawCountry;
    };

    getList = async (params: IEventsListParams): Promise<IResponse<IList<IEvent>>> => {
        try {
            const countryHeaderValue = this.getCountryHeaderValue();
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.events}`,
                params,
                headers: countryHeaderValue ? { 'Location-Country': countryHeaderValue } : undefined,
            });

            if (!response.isError && response.data) {
                const rows = response.data.rows || response.data.items || [];
                const normalizedList: IList<IEvent> = {
                    rows: Array.isArray(rows) ? rows : [],
                    count: typeof response.data.count === 'number' ? response.data.count : rows.length,
                    totalPages: typeof response.data.totalPages === 'number' ? response.data.totalPages : 1,
                };

                if (params.offset === 0) {
                    eventsModel.setList(normalizedList);
                } else {
                    eventsModel.append(normalizedList);
                }

                return {
                    ...response,
                    data: normalizedList,
                };
            }

            return response;
        } catch (error) {
            console.warn('EventService -> getList: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getById = async (id: number): Promise<IResponse<IEventDetail>> => {
        try {
            const countryHeaderValue = this.getCountryHeaderValue();

            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.events}/${id}`,
                headers: countryHeaderValue ? { 'Location-Country': countryHeaderValue } : undefined,
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
            const countryHeaderValue = this.getCountryHeaderValue();

            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.events}/${id}/toggle-save`,
                headers: countryHeaderValue ? { 'Location-Country': countryHeaderValue } : undefined,
            });

            if (!response.isError) {
                const updatedEvents = eventsModel.events.map(event =>
                    event.id === id ? { ...event, isSaved: response.data.isSaved } : event,
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
            const countryHeaderValue = this.getCountryHeaderValue();

            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.events}/${id}/register`,
                headers: countryHeaderValue ? { 'Location-Country': countryHeaderValue } : undefined,
            });

            return response;
        } catch (error) {
            console.warn('EventService -> registerForEvent: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getMapPins = async (params: IEventMapPinsParams): Promise<IResponse<IEventMapPin[]>> => {
        try {
            const countryHeaderValue = this.getCountryHeaderValue();

            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.eventMapPins}`,
                params,
                headers: countryHeaderValue ? { 'Location-Country': countryHeaderValue } : undefined,
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
            const countryHeaderValue = this.getCountryHeaderValue();

            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.events}`,
                data,
                headers: countryHeaderValue ? { 'Location-Country': countryHeaderValue } : undefined,
            });

            return response;
        } catch (error) {
            console.warn('EventService -> createEvent: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const eventService = new EventService(requester, links);
