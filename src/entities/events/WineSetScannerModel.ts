import { MobXRepository } from '@/repository/MobXRepository';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { IAddEventDraft } from '@/modules/event/types/IAddEventDraft';

interface IWineSetScannerState {
    draft: IAddEventDraft;
    selectedWines: IWineSetSearchItem[];
}

class WineSetScannerModel {
    private stateRepository = new MobXRepository<IWineSetScannerState | null>(null);

    public get state() {
        return this.stateRepository.data;
    }

    public set state(value: IWineSetScannerState | null) {
        this.stateRepository.save(value);
    }

    public setState(value: IWineSetScannerState) {
        this.state = value;
    }

    public clear() {
        this.state = null;
    }
}

export const wineSetScannerModel = new WineSetScannerModel();
