import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IList } from '../IList';
import { IEvent, IEventDetail } from './types/IEvent';
import { IEventsListParams } from './params/IEventsListParams';
import { IEventMapPin } from './types/IEventMapPin';
import { IEventMapPinsParams } from './params/IEventMapPinsParams';
import { CreateEventDto } from './dto/CreateEvent.dto';
import { eventsModel } from './EventsModel';
import { IEventPriceRange } from './types/IEventPriceRange';
import { IGetEventsParams } from './params/IGetEventsParams';
import { ISavedEvent } from './types/ISavedEvent';
import { IAppliedEvent } from './types/IAppliedEvent';
import { IUserCurrencies } from '../users/types/IUserCurrencies';

const EVENT_TASTING_REPORT_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

class EventsService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    private getCountryHeaderValue = (countryCode?: string) => {
        const normalizedCountryCode = (countryCode || '').trim().toUpperCase();

        return normalizedCountryCode.length === 2 ? normalizedCountryCode : '';
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

    exportTastingReport = async (eventId: number): Promise<IResponse<ArrayBuffer>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.eventTasting}/${eventId}/export`,
                responseType: 'arraybuffer',
                headers: {
                    Accept: EVENT_TASTING_REPORT_MIME_TYPE,
                },
            });

            return response;
        } catch (error) {
            console.warn('EventsService -> exportTastingReport: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    private getEventById = (id: number): IEvent | IEventDetail | null => {
        const eventFromEvents = eventsModel.events.find(event => event.id === id);
        if (eventFromEvents) {
            return eventFromEvents;
        }

        const eventFromCreated = eventsModel.createdEvents?.rows.find(event => event.id === id);
        if (eventFromCreated) {
            return eventFromCreated;
        }

        const eventFromSaved = eventsModel.savedEvents?.rows.find(event => event.id === id);
        if (eventFromSaved) {
            return eventFromSaved;
        }

        const appliedEvent = eventsModel.appliedEvents.find(item => item.event.id === id);
        if (appliedEvent) {
            return appliedEvent.event;
        }

        if (eventsModel.eventDetail?.id === id) {
            return eventsModel.eventDetail;
        }

        return null;
    };

    private updateEventInModels = (id: number, fields: Partial<IEventDetail>) => {
        const updatedEvents = eventsModel.events.map(event => {
            if (event.id !== id) {
                return event;
            }

            return {
                ...event,
                ...fields,
            };
        });
        eventsModel.setEvents(updatedEvents);

        if (eventsModel.createdEvents) {
            eventsModel.createdEvents = {
                ...eventsModel.createdEvents,
                rows: eventsModel.createdEvents.rows.map(event => {
                    if (event.id !== id) {
                        return event;
                    }

                    return {
                        ...event,
                        ...fields,
                    };
                }),
            };
        }

        if (eventsModel.savedEvents) {
            eventsModel.savedEvents = {
                ...eventsModel.savedEvents,
                rows: eventsModel.savedEvents.rows.map(event => {
                    if (event.id !== id) {
                        return event;
                    }

                    return {
                        ...event,
                        ...fields,
                    };
                }),
            };
        }

        if (eventsModel.appliedEvents.length) {
            eventsModel.appliedEvents = eventsModel.appliedEvents.map(item => {
                if (item.event.id !== id) {
                    return item;
                }

                return {
                    ...item,
                    event: {
                        ...item.event,
                        ...fields,
                    },
                };
            });
        }

        if (eventsModel.eventDetail?.id === id) {
            eventsModel.setEventDetail({
                ...eventsModel.eventDetail,
                ...fields,
            });
        }
    };

    private getEventSnapshotById = (id: number): IEvent | IEventDetail | null => {
        const eventFromCreated = eventsModel.createdEvents?.rows.find(event => event.id === id);
        if (eventFromCreated) {
            return eventFromCreated;
        }

        const eventFromList = eventsModel.events.find(event => event.id === id);
        if (eventFromList) {
            return eventFromList;
        }

        const eventFromApplied = eventsModel.appliedEvents.find(item => item.event.id === id)?.event;
        if (eventFromApplied) {
            return eventFromApplied;
        }

        if (eventsModel.eventDetail?.id === id) {
            return eventsModel.eventDetail;
        }

        return null;
    };

    private mapEventToSavedEvent = (eventSnapshot: IEvent | IEventDetail): ISavedEvent => {
        const resolvedPriceUsd = 'priceUsd' in eventSnapshot ? eventSnapshot.priceUsd : eventSnapshot.price;
        const resolvedDistanceKm = eventSnapshot.distanceKm ?? null;
        const resolvedCurrency = eventSnapshot.currency || '';

        return {
            ...eventSnapshot,
            priceUsd: resolvedPriceUsd,
            distanceKm: resolvedDistanceKm,
            currency: resolvedCurrency,
            isSaved: true,
        };
    };

    private applyFavoriteState = (id: number, isSaved: boolean) => {
        this.updateEventInModels(id, { isSaved });

        if (!eventsModel.savedEvents) {
            return;
        }

        if (!isSaved) {
            const filteredRows = eventsModel.savedEvents.rows.filter(event => event.id !== id);
            const wasInSaved = filteredRows.length !== eventsModel.savedEvents.rows.length;
            eventsModel.savedEvents = {
                ...eventsModel.savedEvents,
                rows: filteredRows,
                count: wasInSaved ? Math.max(0, eventsModel.savedEvents.count - 1) : eventsModel.savedEvents.count,
            };
            return;
        }

        const alreadySaved = eventsModel.savedEvents.rows.some(event => event.id === id);
        if (alreadySaved) {
            return;
        }

        const eventSnapshot = this.getEventSnapshotById(id);
        if (!eventSnapshot) {
            return;
        }

        const nextSavedEvent = this.mapEventToSavedEvent(eventSnapshot);

        eventsModel.savedEvents = {
            ...eventsModel.savedEvents,
            rows: [nextSavedEvent, ...eventsModel.savedEvents.rows],
            count: eventsModel.savedEvents.count + 1,
        };
    };

    private applyBookingState = (id: number, isApplied: boolean) => {
        const currentEvent = this.getEventById(id);
        const currentSeatsLeft = currentEvent?.seats?.left;

        if (typeof currentSeatsLeft === 'number' && currentEvent?.seats) {
            const seatsDelta = isApplied ? -1 : 1;
            const nextSeatsLeft = Math.max(0, currentSeatsLeft + seatsDelta);

            this.updateEventInModels(id, {
                isApplied,
                seats: {
                    ...currentEvent.seats,
                    left: nextSeatsLeft,
                },
            });
        } else {
            this.updateEventInModels(id, { isApplied });
        }

        if (!isApplied) {
            eventsModel.appliedEvents = eventsModel.appliedEvents.filter(item => item.event.id !== id);
        }
    };

    updateEvent = async (id: number, data: Partial<IEventDetail>): Promise<IResponse<IEventDetail>> => {
        try {
            const response = await this._requester.request({
                method: 'PATCH',
                url: `${this._links.events}/${id}`,
                data,
            });

            if (!response.isError) {
                const responseFields = response.data && typeof response.data === 'object' ? response.data : {};
                const updatedFields = {
                    ...data,
                    ...responseFields,
                };

                this.updateEventInModels(id, updatedFields);
            }

            return response;
        } catch (error) {
            console.warn('EventsService -> updateEvent: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    toggleSave = async (id: number): Promise<IResponse<IEventDetail>> => {
        const currentEvent = this.getEventById(id);
        const currentIsSaved = Boolean(currentEvent?.isSaved);
        if (currentIsSaved) {
            return this.removeFromFavorite(id);
        }

        return this.addToFavorite(id);
    };

    addToFavorite = async (eventId: number): Promise<IResponse<IEventDetail>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.favoriteEvents}`,
                data: { eventId },
            });

            if (!response.isError) {
                this.applyFavoriteState(eventId, true);
            }

            return response;
        } catch (error) {
            console.warn('EventsService -> addToFavorite: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    removeFromFavorite = async (eventId: number): Promise<IResponse<IEventDetail>> => {
        try {
            const response = await this._requester.request({
                method: 'DELETE',
                url: `${this._links.favoriteEvents}/${eventId}`,
            });

            if (!response.isError) {
                this.applyFavoriteState(eventId, false);
            }

            return response;
        } catch (error) {
            console.warn('EventsService -> removeFromFavorite: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    applyForEvent = async (eventId: number): Promise<IResponse<{ success: boolean }>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.eventBookings}`,
                data: { eventId },
            });

            if (!response.isError) {
                this.applyBookingState(eventId, true);
            }

            return response;
        } catch (error) {
            console.warn('EventsService -> applyForEvent: ', error);
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

    getCreatedEvents = async (params: IGetEventsParams): Promise<IResponse<IList<IEvent>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.createdEvents}`,
                params,
            });

            if (!response.isError && response.data) {
                const rows = response.data.rows || response.data.items || [];
                const normalizedList: IList<IEvent> = {
                    rows: Array.isArray(rows) ? rows : [],
                    count: typeof response.data.count === 'number' ? response.data.count : rows.length,
                    totalPages: 0,
                };

                if (params.offset === 0) {
                    eventsModel.createdEvents = normalizedList;
                } else {
                    eventsModel.appendCreatedEvents(normalizedList);
                }
                return {
                    ...response,
                    data: normalizedList,
                };
            }

            return response;
        } catch (error) {
            console.warn('EventsService -> getCreatedEvents: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getSavedEvents = async (params: IGetEventsParams): Promise<IResponse<IList<ISavedEvent>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.favoriteEvents}`,
                params,
            });

            if (!response.isError && response.data) {
                const rows = response.data.rows || response.data.items || [];
                const normalizedList: IList<ISavedEvent> = {
                    rows: Array.isArray(rows) ? rows : [],
                    count: typeof response.data.count === 'number' ? response.data.count : rows.length,
                    totalPages: 0,
                };

                if (params.offset === 0) {
                    eventsModel.savedEvents = normalizedList;
                } else {
                    eventsModel.appendSavedEvents(normalizedList);
                }
                return {
                    ...response,
                    data: normalizedList,
                };
            }

            return response;
        } catch (error) {
            console.warn('EventsService -> getSavedEvents: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getAppliedEvents = async (): Promise<IResponse<IAppliedEvent[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.appliedEvents}`,
            });

            if (!response.isError && response.data) {
                const normalizedList: IAppliedEvent[] = Array.isArray(response.data) ? response.data : [];
                eventsModel.appliedEvents = normalizedList;
                return {
                    ...response,
                    data: normalizedList,
                };
            }

            return response;
        } catch (error) {
            console.warn('EventsService -> getAppliedEvents: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getCurrencies = async (): Promise<IResponse<IUserCurrencies>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.userCurrencies}`,
            });

            return response;
        } catch (error) {
            console.warn('EventsService -> getCurrencies: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const eventsService = new EventsService(requester, links);
