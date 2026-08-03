import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { IWineOffer } from '@/entities/wine/types/IWineOffer';

export type IWineryLinkedWineOffer = Pick<
    IWineOffer,
    'id' | 'price' | 'currency' | 'quantity' | 'websiteUrl'
>;

export interface IWineryLinkedWine extends IWineListItem {
    offer: IWineryLinkedWineOffer | null;
}
