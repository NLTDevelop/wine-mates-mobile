import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IFAQListItem } from './types/IFAQListItem';

class FAQService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    list = async (): Promise<IResponse<IFAQListItem[]>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.faq}`,
            });

            return response;
        } catch (error) {
            console.warn('FAQService -> list: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const faqService = new FAQService(requester, links);
