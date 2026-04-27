import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IList } from '../IList';
import { IEvent, IEventDetail } from './types/IEvent';
import { IEventsListParams } from './params/IEventsListParams';
import { IEventMapPin } from './types/IEventMapPin';
import { IEventMapPinsParams } from './params/IEventMapPinsParams';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { eventsModel } from './EventsModel';
import countries from 'world-countries';
import { IEventPriceRange } from './types/IEventPriceRange';

class EventsService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    private getCountryHeaderValue = (countryName?: string) => {
        const rawCountry = (countryName || '').trim();
        if (!rawCountry) {
            return '';
        }

        const normalizedCountry = rawCountry.toUpperCase();
        const country = countries.find(
            item =>
                item.cca2?.toUpperCase() === normalizedCountry ||
                item.cca3?.toUpperCase() === normalizedCountry ||
                item.name?.common?.toUpperCase() === normalizedCountry ||
                item.name?.official?.toUpperCase() === normalizedCountry,
        );

        if (country?.name?.common) {
            return country.name.common;
        }

        if (rawCountry.length !== 2 && rawCountry.length !== 3) {
            return rawCountry;
        }

        try {
            const regionName = new Intl.DisplayNames(['en'], { type: 'region' }).of(normalizedCountry);
            if (regionName && regionName !== normalizedCountry) {
                return regionName;
            }
        } catch {
            return rawCountry;
        }

        return rawCountry;
    };

    getList = async (params: IEventsListParams): Promise<IResponse<IList<IEvent>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.events}`,
                params,
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
            console.warn('EventsService -> getList: ', error);
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
            console.warn('EventsService -> getById: ', error);
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
            console.warn('EventsService -> toggleSave: ', error);
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
            console.warn('EventsService -> registerForEvent: ', error);
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
            console.warn('EventsService -> getMapPins: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    createEvent = async (data: CreateEventDto, countryName?: string): Promise<IResponse<IEventDetail>> => {
        try {
            const countryHeaderValue = this.getCountryHeaderValue(countryName);

            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.events}`,
                data,
                headers: countryHeaderValue ? { 'Location-Country': countryHeaderValue } : undefined,
            });

            return response;
        } catch (error) {
            console.warn('EventsService -> createEvent: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getPriceRange = async (): Promise<IResponse<IEventPriceRange>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.eventPriceRange}`,
            });

            if (!response.isError && response.data) {
                const responseMinPrice = Math.floor(Number(response.data.minPrice));
                const responseMaxPrice = Math.ceil(Number(response.data.maxPrice));
                if (Number.isFinite(responseMinPrice) && Number.isFinite(responseMaxPrice)) {
                    const minPrice = Math.max(0, responseMinPrice);
                    const maxPrice = Math.max(minPrice, responseMaxPrice);
                    eventsModel.setEventPriceRange({ minPrice, maxPrice });
                }
            }

            return response;
        } catch (error) {
            console.warn('EventsService -> getPriceRange: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const eventsService = new EventsService(requester, links);
