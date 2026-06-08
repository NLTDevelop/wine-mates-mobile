import { MobXRepository } from '@/repository/MobXRepository';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { RepeatRuleConfig } from '@/entities/events/types/RepeatRuleConfig';
import { TastingType } from '@/entities/events/enums/TastingType';

interface IAddEventWineSetDraftState {
    selectedWines: IWineSetSearchItem[];
    repeatRule: RepeatRuleConfig | null;
    tastingType: TastingType;
}

class AddEventWineSetDraftModel {
    private stateRepository = new MobXRepository<IAddEventWineSetDraftState | null>(null);

    public get state() {
        return this.stateRepository.data;
    }

    public set state(value: IAddEventWineSetDraftState | null) {
        this.stateRepository.save(value);
    }
}

export const addEventWineSetDraftModel = new AddEventWineSetDraftModel();
