import { IWineListItem } from './IWineListItem';
import { IWineOffer } from './IWineOffer';

export type IWineOfferSummary = Pick<IWineOffer, 'id' | 'price' | 'currency' | 'quantity' | 'websiteUrl'>;

export interface IOfferedWineListItem extends IWineListItem {
    offer: IWineOfferSummary | null;
}

export interface IWineOfferTarget {
    id: number;
}

export type IWineOfferSaveResult =
    | {
          type: 'created';
          wine: IOfferedWineListItem;
      }
    | {
          type: 'updated';
          wineId: number;
          offer: IWineOfferSummary;
      };
