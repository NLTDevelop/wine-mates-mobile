import { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IWineBase, IWineBaseValue } from '@/entities/wine/types/IWineBase';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';

type Route = RouteProp<EventStackParamList, 'EditEventWineView'>;

const createValue = (): IWineBaseValue => ({ id: null, value: '' });

const createInitialForm = (wine: IWineSetSearchItem): IWineBase => {
    const countryName = typeof wine.country === 'string' ? wine.country : wine.country?.name || '';
    const regionName = typeof wine.region === 'string' ? wine.region : wine.region?.name || '';

    return {
        typeOfWine: createValue(),
        colorOfWine: createValue(),
        country: { id: null, value: countryName || '' },
        region: { id: null, value: regionName || '' },
        producer: { id: null, value: wine.producer || '' },
        grapeVariety: { id: null, value: wine.grapeVariety || '' },
        vintageYear: { id: null, value: wine.vintage ? String(wine.vintage) : '' },
        wineName: { id: null, value: wine.name || '' },
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
        value: String(item.value) || '',
    };
};

const getWineSetSearchItem = (id: number, form: IWineBase): IWineSetSearchItem => {
    return {
        id,
        name: form.wineName.value || '',
        producer: form.producer.value,
        vintage: form.vintageYear.value ? Number(form.vintageYear.value) : null,
        grapeVariety: form.grapeVariety.value,
        country: form.country.value,
        region: form.region.value,
        image: null,
    };
};

export const useEditEventWineView = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<Route>();
    const { wineId, wine, draft, selectedWines } = route.params;
    const [form, setForm] = useState<IWineBase>(() => createInitialForm(wine));
    const [inProgress, setInProgress] = useState(false);
    const [isVintageError, setIsVintageError] = useState({ status: false, errorText: '' });

    const isDisabled = useMemo(() => {
        const baseRequired = [
            form.typeOfWine.value,
            form.colorOfWine.value,
            form.country.value,
            form.producer.value,
            form.grapeVariety.value,
        ];

        return baseRequired.some(field => !field?.trim());
    }, [form]);

    useEffect(() => {
        let isActive = true;

        const onFillForm = async () => {
            try {
                const response = await wineService.getById(wineId);

                if (!isActive || response.isError || !response.data) {
                    return;
                }

                const data = response.data;
                setForm({
                    typeOfWine: { id: data.type.id, value: data.type.name },
                    colorOfWine: { id: data.color.id, value: data.color.name },
                    country: { id: data.country.id, value: data.country.name },
                    region: data.region
                        ? { id: data.region.id, value: data.region.name }
                        : createValue(),
                    producer: { id: null, value: data.producer || '' },
                    grapeVariety: { id: null, value: data.grapeVariety || '' },
                    vintageYear: { id: null, value: data.vintage ? String(data.vintage) : '' },
                    wineName: { id: null, value: data.name || '' },
                });
            } catch (error) {
                console.warn('useEditEventWineView -> onFillForm: ', error);
            }
        };

        onFillForm();

        return () => {
            isActive = false;
        };
    }, [wineId]);

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
        setIsVintageError({ status: false, errorText: '' });
        setForm(prev => ({ ...prev, vintageYear: { ...prev.vintageYear, value: numericValue } }));
    }, []);

    const onChangeWineName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, wineName: { ...prev.wineName, value } }));
    }, []);

    const onSavePress = useCallback(async () => {
        if (!form.typeOfWine.id || !form.colorOfWine.id) {
            return;
        }

        try {
            setInProgress(true);

            const formData = new FormData();

            if (form.wineName.value?.trim()) {
                formData.append('name', form.wineName.value);
            }
            if (form.vintageYear.value?.trim()) {
                formData.append('vintage', Number(form.vintageYear.value));
            }
            formData.append('countryId', form.country.id);
            if (form.region.id) {
                formData.append('regionId', form.region.id);
            }
            formData.append('producer', form.producer.value);
            formData.append('grapeVariety', form.grapeVariety.value);
            formData.append('typeId', form.typeOfWine.id);
            formData.append('colorId', form.colorOfWine.id);

            const response = await wineService.createWine(formData);

            if (response.isError || !response.data) {
                if (response?.errors?.errors?.vintage) {
                    setIsVintageError({ status: true, errorText: response.errors.errors.vintage[0] });
                } else {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                }
                return;
            }

            navigation.navigate('AddWineSetView', {
                draft,
                initialSelectedWines: selectedWines,
                replacedWine: {
                    previousWineId: wineId,
                    newWine: getWineSetSearchItem(response.data.id, form),
                },
            });
        } catch (error) {
            console.warn('useEditEventWineView -> onSavePress: ', error);
        } finally {
            setInProgress(false);
        }
    }, [draft, form, navigation, selectedWines, wineId]);

    return {
        form,
        inProgress,
        isVintageError,
        isDisabled,
        onChangeType,
        onChangeColor,
        onChangeCountry,
        onChangeRegion,
        onChangeWinery,
        onChangeGrapeVariety,
        onChangeVintageYear,
        onChangeWineName,
        onSavePress,
    };
};
