import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IContactsListItem } from './types/IContactsListItem';
import { contactsModel } from './ContactsModel';
import { ContactListParams } from './params/ContactListParams';
import { CreateContactDto } from './dto/CreateContact.dto';
import { UpdateContactDto } from './dto/UpdateContact.dto';

class ContactsService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    list = async (params?: ContactListParams): Promise<IResponse<IContactsListItem[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.contacts}`,
                params
            });

            if (!response.isError) {
                contactsModel.list = response.data;
            }

            return response;
        } catch (error) {
            console.warn('ContactsService -> list: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    create = async (data: CreateContactDto): Promise<IResponse<IContactsListItem>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.contacts}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('ContactsService -> create: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    update = async (id: number, data: UpdateContactDto): Promise<IResponse<IContactsListItem>> => {
        try {
            const response = await this._requester.request({
                method: 'PATCH',
                url: `${this._links.contacts}/${id}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('ContactsService -> update: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const contactsService = new ContactsService(requester, links);
