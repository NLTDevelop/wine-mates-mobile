import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineModel } from '@/entities/wine/WineModel';
import { IWineBase, IWineBaseValue } from '@/entities/wine/types/IWineBase';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IAIData } from '@/entities/wine/types/IAIData';

const createValue = (): IWineBaseValue => ({ id: null, value: '' });

const createInitialForm = (aiData?: IAIData | null): IWineBase => {
    const baseForm: IWineBase = {
        typeOfWine: createValue(),
        colorOfWine: createValue(),
        country: createValue(),
        region: createValue(),
        producer: createValue(),
        grapeVariety: createValue(),
        vintageYear: createValue(),
        wineName: createValue(),
    };

    if (!aiData) {
        return baseForm;
    }

    return {
        ...baseForm,
        typeOfWine: aiData.typeId
            ? { ...baseForm.typeOfWine, id: aiData.typeId.id, value: aiData.typeId.name }
            : baseForm.typeOfWine,
        colorOfWine: aiData.colorId
            ? { ...baseForm.colorOfWine, id: aiData.colorId.id, value: aiData.colorId.name }
            : baseForm.colorOfWine,
        country: aiData.countryId
            ? { ...baseForm.country, id: aiData.countryId.id, value: aiData.countryId.name }
            : baseForm.country,
        region: aiData.regionId
            ? { ...baseForm.region, id: aiData.regionId.id, value: aiData.regionId.name }
            : baseForm.region,
        producer: { ...baseForm.producer, value: aiData.producer ?? '' },
        grapeVariety: { ...baseForm.grapeVariety, value: aiData.grapeVariety ?? '' },
        vintageYear: { ...baseForm.vintageYear, value: aiData.vintage != null ? String(aiData.vintage) : '' },
        wineName: { ...baseForm.wineName, value: aiData.name ?? '' },
    };
};

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
    const route = useRoute();
    const aiData = (route.params as { aiData?: IAIData | null } | undefined)?.aiData ?? null;
    const [form, setForm] = useState<IWineBase>(() => createInitialForm(aiData));
    const [inProgress, setInProgress] = useState(false);
    const [isVintageError, setIsVintageError] = useState({status: false, errorText: ''});
    const isDisabled = useMemo(() => {
        const baseRequired = [
            form.typeOfWine.value,
            form.colorOfWine.value,
            form.country.value,
            form.producer.value,
            form.grapeVariety.value,
            form.wineName.value,
            form.vintageYear.value,
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
        setForm(prev => ({ ...prev, producer: { ...prev.producer, value } }));
    }, []);

    const onChangeGrapeVariety = useCallback((value: string) => {
        setForm(prev => ({ ...prev, grapeVariety: { ...prev.grapeVariety, value } }));
    }, []);

    const onChangeVintageYear = useCallback((value: string) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 4);
        setIsVintageError({status: false, errorText: ''});
        setForm(prev => ({ ...prev, vintageYear: { ...prev.vintageYear, value: numericValue } }));
    }, []);

    const onChangeWineName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, wineName: { ...prev.wineName, value } }));
    }, []);

    const handleNextPress = useCallback(async () => {
        try {
            if (!form.typeOfWine.id || !form.colorOfWine.id) return;

            setInProgress(true);

            const formData = new FormData();
            formData.append('name', form.wineName.value);
            if (form.vintageYear.value) {
                formData.append('vintage', Number(form.vintageYear.value));
            }
            formData.append('countryId', form.country.id);
            formData.append('regionId', form.region.id);
            formData.append('producer', form.producer.value);
            formData.append('grapeVariety', form.grapeVariety.value);
            formData.append('typeId', form.typeOfWine.id);
            formData.append('colorId', form.colorOfWine.id);

            if (wineModel.image) {
                formData.append('image', wineModel.image as any);
            }

            const response = await wineService.createWine(formData);

            if (response.isError || !response.data) {
                if (response.status === 409) {
                    const selectedType = wineModel.wineTypes?.find(type => type.id === form.typeOfWine.id);
                    wineModel.clear();
                    wineModel.wine = {
                        id: Number(response.errors.wineId || 0),
                        vintage: Number(form.vintageYear.value),
                        name: form.wineName.value || '',
                    };
                    wineModel.base = {
                        ...form,
                        typeOfWine: {
                            ...form.typeOfWine,
                            isSparkling: selectedType?.isSparkling,
                        },
                    };

                    navigation.navigate('WineLookView');
                } else if (response?.errors?.errors?.vintage) {
                    setIsVintageError({status: true, errorText: response.errors.errors.vintage[0]});
                } else {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                }
            } else {
                const selectedType = wineModel.wineTypes?.find(type => type.id === form.typeOfWine.id);
                wineModel.clear();
                wineModel.base = {
                    ...form,
                    typeOfWine: {
                        ...form.typeOfWine,
                        isSparkling: selectedType?.isSparkling,
                    },
                };
                wineModel.wine = {
                    id: response.data.id,
                    name: response.data.name,
                    vintage: response.data.vintage,
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
        isDisabled, onChangeType, onChangeColor, onChangeCountry, onChangeRegion, inProgress, isVintageError
    };
};
