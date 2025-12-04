import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineModel } from '@/entities/wine/WineModel';
import { IWineBase, IWineBaseValue } from '@/entities/wine/types/IWineBase';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

const createValue = (): IWineBaseValue => ({ id: null, value: '' });

const createInitialForm = (): IWineBase => ({
    typeOfWine: createValue(),
    colorOfWine: createValue(),
    country: createValue(),
    region: createValue(),
    winery: createValue(),
    grapeVariety: createValue(),
    vintageYear: createValue(),
    wineName: createValue(),
});

const fromDropdown = (item?: IDropdownItem | null): IWineBaseValue => {
    if (!item) {
        return createValue();
    }

    const parsedId =
        typeof item.id === 'number'
            ? item.id
            : typeof item.id === 'string' && item.id.trim() && !Number.isNaN(Number(item.id))
                ? Number(item.id)
                : null;

    return {
        id: parsedId,
        value: item.value || '',
    };
};

export const useAddWine = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [form, setForm] = useState<IWineBase>(createInitialForm);
    const [inProgress, setInProgress] = useState(false);
    const isDisabled = useMemo(() => {
        const baseRequired = [
            form.typeOfWine.value,
            form.colorOfWine.value,
            form.country.value,
            form.winery.value,
            form.grapeVariety.value,
            form.vintageYear.value,
            form.wineName.value,
        ];
        const hasEmptyBase = baseRequired.some(field => !field?.trim());

        return hasEmptyBase;
    }, [form]);

    useEffect(() => {
        return () => wineModel.clear();
    }, []);

    const onChangeType = useCallback((item: IDropdownItem) => {
        setForm(prev => ({ ...prev, typeOfWine: fromDropdown(item), colorOfWine: createValue() }));
    }, []);

    const onChangeColor = useCallback((item: IDropdownItem) => {
        setForm(prev => ({ ...prev, colorOfWine: fromDropdown(item) }));
    }, []);

    const onChangeCountry = useCallback((item: IDropdownItem) => {
        setForm(prev => ({ ...prev, country: fromDropdown(item), region: createValue() }));
    }, []);

    const onChangeRegion = useCallback((item: IDropdownItem) => {
        setForm(prev => ({ ...prev, region: fromDropdown(item) }));
    }, []);

    const onChangeWinery = useCallback((value: string) => {
        setForm(prev => ({ ...prev, winery: { ...prev.winery, value } }));
    }, []);

    const onChangeGrapeVariety = useCallback((value: string) => {
        setForm(prev => ({ ...prev, grapeVariety: { ...prev.grapeVariety, value } }));
    }, []);

    const onChangeVintageYear = useCallback((value: string) => {
        setForm(prev => ({ ...prev, vintageYear: { ...prev.vintageYear, value } }));
    }, []);

    const onChangeWineName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, wineName: { ...prev.wineName, value } }));
    }, []);

    const handleNextPress = useCallback(async () => {
        try {
            if (!form.typeOfWine.id || !form.colorOfWine.id || !wineModel.image) return;

            setInProgress(true);

            const formData = new FormData();
            formData.append('name', form.wineName.value);
            formData.append('vintage', Number(form.vintageYear.value));
            formData.append('countryId', 1);
            formData.append('regionId', 1);
            formData.append('winery', form.winery.value);
            formData.append('grapeVariety', form.grapeVariety.value);
            formData.append('image', wineModel.image as any);
            formData.append('typeId', form.typeOfWine.id);
            formData.append('colorId', form.colorOfWine.id);

            const response = await wineService.createWine(formData);

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
                const selectedType = wineModel.wineTypes?.find(type => type.id === form.typeOfWine.id);

                wineModel.base = {
                    ...form,
                    typeOfWine: {
                        ...form.typeOfWine,
                        isSparkling: selectedType?.isSparkling,
                    },
                };
                navigation.navigate('WineLookView');
            }
        } catch (error) {
            console.error('Add wine error: ', JSON.stringify(error, null, 2));
        } finally {
            setInProgress(false);
        }
    }, [navigation, form]);

    return { 
        form, onChangeWinery, onChangeGrapeVariety, onChangeVintageYear, onChangeWineName, handleNextPress,
        isDisabled, onChangeType, onChangeColor, onChangeCountry, onChangeRegion, inProgress
    };
};
