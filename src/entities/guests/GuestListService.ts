import { ILinks, links } from '@/Links';
import { IRequester, IResponse, requester } from '@/libs/requester';
import { IList } from '../IList';
import { UpdateGuestBookingStatusDto } from './dto/UpdateGuestBookingStatus.dto';
import { guestListModel } from './GuestListModel';
import { IGetEventGuestsParams } from './params/IGetEventGuestsParams';
import { IGuestBooking } from './types/IGuestBooking';

class GuestListService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    getEventGuests = async (params: IGetEventGuestsParams): Promise<IResponse<IList<IGuestBooking>>> => {
        try {
            const { eventId, status, ...requestParams } = params;
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.guests}/${eventId}`,
                params: {
                    ...requestParams,
                    status: status || 'all',
                },
            });

            if (!response.isError && response.data) {
                const rawData = response.data as (IList<IGuestBooking> & { items?: IGuestBooking[] }) | IGuestBooking[];
                const rows = Array.isArray(rawData) ? rawData : rawData.rows || rawData.items || [];
                const normalizedList: IList<IGuestBooking> = {
                    rows,
                    count: !Array.isArray(rawData) && typeof rawData.count === 'number' ? rawData.count : rows.length,
                    totalPages:
                        !Array.isArray(rawData) && typeof rawData.totalPages === 'number' ? rawData.totalPages : 0,
                };

                if (params.offset === 0) {
                    guestListModel.guests = normalizedList;
                } else {
                    guestListModel.append(normalizedList);
                }

                return {
                    ...response,
                    data: normalizedList,
                };
            }

            return response;
        } catch (error) {
            console.warn('GuestListService -> getEventGuests: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    updateGuestStatus = async (id: number, data: UpdateGuestBookingStatusDto): Promise<IResponse<IGuestBooking>> => {
        try {
            const response = await this._requester.request({
                method: 'PATCH',
                url: `${this._links.guestsStatuses}/${id}/status`,
                data,
            });

            if (!response.isError) {
                const currentGuests = guestListModel.guests;
                if (currentGuests) {
                    guestListModel.guests = {
                        ...currentGuests,
                        rows: currentGuests.rows.map(guest =>
                            guest.id === id ? { ...guest, status: data.status } : guest,
                        ),
                    };
                }
            }

            return response;
        } catch (error) {
            console.warn('GuestListService -> updateGuestStatus: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const guestListService = new GuestListService(requester, links);
