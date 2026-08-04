import { StackActions } from '@react-navigation/native';
import { IWineScannerState } from '@/entities/events/WineSetScannerModel';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';

export const getWineScannerReturnAction = (state: IWineScannerState, selectedWine?: IWineSetSearchItem) => {
    if ('returnRoute' in state) {
        return StackActions.popTo(state.returnRoute, {
            selectedWine,
            shouldReopenWineSearch: true,
        });
    }

    return StackActions.popTo('AddWineSetView', {
        draft: state.draft,
        initialSelectedWines: state.selectedWines,
        editEventId: state.editEventId,
        isDuplicateEvent: state.isDuplicateEvent,
        selectedWine,
    });
};
