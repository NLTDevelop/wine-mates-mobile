import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';

export type WineChooserPickerKey =
    | 'type'
    | 'color'
    | 'country'
    | 'region'
    | 'vintage'
    | 'grape'
    | 'aroma'
    | 'flavor';

export interface IWineChooserPickerState {
    key: WineChooserPickerKey;
    title: string;
    options: IUniversalPickerOption[];
    isLoading: boolean;
    selectionMode: 'single' | 'multiple';
}
