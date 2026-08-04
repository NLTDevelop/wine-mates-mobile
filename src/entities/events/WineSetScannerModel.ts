import { MobXRepository } from '@/repository/MobXRepository';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { IAddEventDraft } from '@/modules/event/types/IAddEventDraft';

export interface IEventWineScannerState {
    draft: IAddEventDraft;
    selectedWines: IWineSetSearchItem[];
    editEventId?: number;
    isDuplicateEvent?: boolean;
}

export interface IMyOffersWineScannerState {
    returnRoute: 'MyWinesForSaleView';
}

export type IWineScannerState = IEventWineScannerState | IMyOffersWineScannerState;

class WineSetScannerModel {
    private stateRepository = new MobXRepository<IWineScannerState | null>(null);

    public get state() {
        return this.stateRepository.data;
    }

    public set state(value: IWineScannerState | null) {
        this.stateRepository.save(value);
    }

    public setState(value: IWineScannerState) {
        this.state = value;
    }

    public clear() {
        this.state = null;
    }
}

export const wineSetScannerModel = new WineSetScannerModel();
