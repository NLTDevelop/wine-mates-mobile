/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineService } from '@/entities/wine/services/WineService';
import {
    EMPTY_WINE_CHOOSER_FILTERS,
    wineChooserFriendFiltersModel,
    wineChooserMyselfFiltersModel,
} from '@/entities/wine/models/WineChooserFiltersModel';
import {
    IWineChooserFilters,
    IWineChooserGrapeVariety,
    IWineChooserOption,
    WineChooserGender,
    WineChooserMode,
} from '@/entities/wine/types/IWineChooser';
import { IWineType } from '@/entities/wine/types/IWineType';
import { IWineColor } from '@/entities/wine/types/IWineColors';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerModal/types/IUniversalPickerOption';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IWineChooserPickerState, WineChooserPickerKey } from '../types/IWineChooserPicker';
import { IChooseWineTasteFilterLabel } from '../types/IChooseWineTasteFilterItem';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

type RouteParams = {
    ChooseWineFiltersView: {
        mode: WineChooserMode;
    };
};

const AGE_MIN = 18;
const AGE_MAX = 100;
const RATING_MIN = 0;
const RATING_MAX = 100;
const VINTAGE_MIN = 1980;
const VINTAGE_MAX = 2026;
const GRAPE_LIMIT = 100;

const getRatingDescription = (rating: number) => {
    if (rating >= 5) {
        return localization.t('wine.ratingScale.exceptional');
    }

    if (rating >= 4.5) {
        return localization.t('wine.ratingScale.veryHighQuality');
    }

    if (rating >= 4) {
        return localization.t('wine.ratingScale.good');
    }

    if (rating >= 3.5) {
        return localization.t('wine.ratingScale.average');
    }

    if (rating >= 3) {
        return localization.t('wine.ratingScale.mediocre');
    }

    if (rating >= 2.5) {
        return localization.t('wine.ratingScale.poor');
    }

    return localization.t('wine.ratingScale.defective');
};

const getFilterModel = (mode: WineChooserMode) => {
    if (mode === 'myself') {
        return wineChooserMyselfFiltersModel;
    }

    return wineChooserFriendFiltersModel;
};

const getModeFilters = (mode: WineChooserMode) => {
    return getFilterModel(mode).filters;
};

const saveModeFilters = (mode: WineChooserMode, filters: IWineChooserFilters) => {
    getFilterModel(mode).filters = filters;
};

const cloneEmptyFilters = (): IWineChooserFilters => {
    return {
        ...EMPTY_WINE_CHOOSER_FILTERS,
        aromaIds: [],
        flavorIds: [],
        typeIds: [],
        colorIds: [],
        countryIds: [],
        regionIds: [],
        grapeVarieties: [],
        tasteFilters: [],
    };
};

const cloneFilters = (filters: IWineChooserFilters): IWineChooserFilters => {
    return {
        ...filters,
        aromaIds: [...filters.aromaIds],
        flavorIds: [...filters.flavorIds],
        typeIds: [...filters.typeIds],
        colorIds: [...filters.colorIds],
        countryIds: [...filters.countryIds],
        regionIds: [...filters.regionIds],
        grapeVarieties: [...filters.grapeVarieties],
        tasteFilters: filters.tasteFilters.map(item => ({ ...item })),
    };
};

const isFiltersPristine = (filters: IWineChooserFilters) => {
    return !filters.searchQuery &&
        filters.aromaIds.length === 0 &&
        filters.flavorIds.length === 0 &&
        filters.gender === null &&
        filters.ageMin === null &&
        filters.ageMax === null &&
        filters.typeIds.length === 0 &&
        filters.colorIds.length === 0 &&
        filters.countryIds.length === 0 &&
        filters.regionIds.length === 0 &&
        filters.grapeVarieties.length === 0 &&
        filters.vintageMin === null &&
        filters.vintageMax === null &&
        filters.tasteFilters.length === 0 &&
        filters.minUserRating === EMPTY_WINE_CHOOSER_FILTERS.minUserRating &&
        filters.minExpertRating === EMPTY_WINE_CHOOSER_FILTERS.minExpertRating &&
        filters.maxExpertRating === EMPTY_WINE_CHOOSER_FILTERS.maxExpertRating;
};

const formatSelectedNames = (items: { name: string }[], fallback = '') => {
    if (items.length === 0) {
        return fallback;
    }

    return items.map(item => item.name).join(', ');
};

const createCountSubtitle = (wineCount?: number) => {
    if (typeof wineCount !== 'number') {
        return undefined;
    }

    return localization.t('chooseWine.winesCount', { count: wineCount });
};

const getGrapeVarietyName = (item: IWineChooserGrapeVariety) => {
    return item.grapeVariety || item.name || '';
};

const createInactiveTrackColor = (colorHex: string) => {
    if (!colorHex) {
        return undefined;
    }

    if (colorHex.length === 7 && colorHex.startsWith('#')) {
        return `${colorHex}26`;
    }

    return colorHex;
};

const getTasteDisplayLabelIndices = (levelsLength: number, isTriple: boolean) => {
    const firstIndex = 0;
    const lastIndex = Math.max(levelsLength - 1, 0);

    if (levelsLength === 0) {
        return [];
    }

    if (isTriple) {
        const middleIndex = Math.floor((levelsLength - 1) / 2);
        return [firstIndex, middleIndex, lastIndex].filter((index, itemIndex, source) => {
            return source.indexOf(index) === itemIndex;
        });
    }

    return [firstIndex, lastIndex].filter((index, itemIndex, source) => {
        return source.indexOf(index) === itemIndex;
    });
};

const getTasteFilterLabels = (
    levels: IWineTasteCharacteristic['levels'],
    isTriple: boolean,
): IChooseWineTasteFilterLabel[] => {
    const labelIndices = getTasteDisplayLabelIndices(levels.length, isTriple);

    return labelIndices.map(index => {
        return {
            id: levels[index].id,
            name: levels[index].name,
            sortNumber: index + 1,
        };
    });
};

export const useChooseWineFilters = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteParams, 'ChooseWineFiltersView'>>();
    const routeMode = route.params?.mode || 'friend';
    const [mode, setMode] = useState<WineChooserMode>(routeMode);
    const baseOptionsLoadedRef = useRef(false);
    const myselfPrefillLoadedRef = useRef(false);
    const regionsByCountryIdRef = useRef<Record<number, IWineChooserOption[]>>({});
    const aromasFlavorsByTemplateRef = useRef<Record<string, { aromas: IWineChooserOption[]; flavors: IWineChooserOption[] }>>({});
    const tasteCharacteristicsByTemplateRef = useRef<Record<string, IWineTasteCharacteristic[]>>({});

    const [filters, setFilters] = useState<IWineChooserFilters>(() => {
        const savedFilters = getModeFilters(mode);

        if (isFiltersPristine(savedFilters)) {
            return cloneEmptyFilters();
        }

        return cloneFilters(savedFilters);
    });
    const [isInitialLoading, setIsInitialLoading] = useState(mode === 'myself');
    const [isApplying, setIsApplying] = useState(false);
    const [types, setTypes] = useState<IWineType[]>([]);
    const [colors, setColors] = useState<IWineColor[]>([]);
    const [countries, setCountries] = useState<IWineChooserOption[]>([]);
    const [regions, setRegions] = useState<IWineChooserOption[]>([]);
    const [grapeVarieties, setGrapeVarieties] = useState<IWineChooserGrapeVariety[]>([]);
    const [aromas, setAromas] = useState<IWineChooserOption[]>([]);
    const [flavors, setFlavors] = useState<IWineChooserOption[]>([]);
    const [tasteCharacteristics, setTasteCharacteristics] = useState<IWineTasteCharacteristic[]>([]);
    const [loadingPickerKey, setLoadingPickerKey] = useState<WineChooserPickerKey | null>(null);
    const [pickerState, setPickerState] = useState<IWineChooserPickerState | null>(null);
    const [applyTasteCharacteristics, setApplyTasteCharacteristics] = useState(true);

    const selectedTypeId = filters.typeIds[0];
    const selectedColorId = filters.colorIds[0];
    const selectedCountryId = filters.countryIds[0];

    const patchFilters = useCallback((payload: Partial<IWineChooserFilters>) => {
        setFilters(prevState => {
            const nextState = { ...prevState, ...payload };
            saveModeFilters(mode, nextState);
            return nextState;
        });
    }, [mode]);

    const showLoadError = useCallback((message?: string) => {
        toastService.showError(
            localization.t('common.errorHappened'),
            message || localization.t('common.somethingWentWrong'),
        );
    }, []);

    const loadBaseOptions = useCallback(async () => {
        if (baseOptionsLoadedRef.current) {
            return;
        }

        const [typeResponse, colorResponse, countryResponse] = await Promise.all([
            wineService.getTypes(),
            wineService.getColors(),
            wineService.getWineChooserCountries(),
        ]);

        if (!typeResponse.isError && typeResponse.data) {
            setTypes(typeResponse.data);
        }

        if (!colorResponse.isError && colorResponse.data) {
            setColors(colorResponse.data);
        }

        if (!countryResponse.isError && countryResponse.data) {
            setCountries(countryResponse.data);
        }

        if (!typeResponse.isError && !colorResponse.isError && !countryResponse.isError) {
            baseOptionsLoadedRef.current = true;
        }
    }, []);

    const loadPrefill = useCallback(async () => {
        if (mode !== 'myself') {
            return null;
        }

        if (myselfPrefillLoadedRef.current || !isFiltersPristine(getModeFilters('myself'))) {
            return null;
        }

        myselfPrefillLoadedRef.current = true;
        const response = await wineService.getWineChooserPrefill();

        if (response.isError || !response.data) {
            if (response.message) {
                showLoadError(response.message);
            }
            return null;
        }

        const nextFilters = {
            ...cloneEmptyFilters(),
            countryIds: response.data.countryId ? [response.data.countryId] : [],
            typeIds: response.data.typeId ? [response.data.typeId] : [],
            colorIds: response.data.colorId ? [response.data.colorId] : [],
            tasteFilters: (response.data.tasteCharacteristics || []).map(item => {
                return {
                    characteristicId: item.characteristicId,
                    minSortNumber: Math.max(1, item.avgSortNumber - 1),
                    maxSortNumber: Math.min(5, item.avgSortNumber + 1),
                };
            }),
        };

        return nextFilters;
    }, [mode, showLoadError]);

    const loadRegionsByCountryId = useCallback(async (countryId: number) => {
        if (!countryId) {
            return;
        }

        const cachedRegions = regionsByCountryIdRef.current[countryId];

        if (cachedRegions) {
            setRegions(cachedRegions);
            return;
        }

        setLoadingPickerKey('region');
        const response = await wineService.getWineChooserRegions({ countryId });

        if (response.isError || !response.data) {
            showLoadError(response.message);
            setRegions([]);
        } else {
            regionsByCountryIdRef.current[countryId] = response.data;
            setRegions(response.data);
        }

        setLoadingPickerKey(null);
    }, [showLoadError]);

    const loadGrapeVarieties = useCallback(async () => {
        setLoadingPickerKey('grape');
        const response = await wineService.getWineChooserGrapeVarieties({ limit: GRAPE_LIMIT, offset: 0 });

        if (response.isError || !response.data) {
            showLoadError(response.message);
        } else {
            setGrapeVarieties(response.data.rows);
        }

        setLoadingPickerKey(null);
    }, [showLoadError]);

    const loadAromasFlavors = useCallback(async () => {
        if (!selectedTypeId || !selectedColorId) {
            return;
        }

        const cacheKey = `${selectedTypeId}:${selectedColorId}`;
        const cachedData = aromasFlavorsByTemplateRef.current[cacheKey];

        if (cachedData) {
            setAromas(cachedData.aromas);
            setFlavors(cachedData.flavors);
            return;
        }

        setLoadingPickerKey('aroma');
        const response = await wineService.getWineChooserAromasFlavors({
            typeId: selectedTypeId,
            colorId: selectedColorId,
        });

        if (response.isError || !response.data) {
            showLoadError(response.message);
        } else {
            const nextData = {
                aromas: response.data.aromas || [],
                flavors: response.data.flavors || [],
            };
            aromasFlavorsByTemplateRef.current[cacheKey] = nextData;
            setAromas(nextData.aromas);
            setFlavors(nextData.flavors);
        }

        setLoadingPickerKey(null);
    }, [selectedColorId, selectedTypeId, showLoadError]);

    const loadTasteCharacteristics = useCallback(async () => {
        if (!selectedTypeId || !selectedColorId) {
            setTasteCharacteristics([]);
            return;
        }

        const cacheKey = `${selectedTypeId}:${selectedColorId}`;
        const cachedData = tasteCharacteristicsByTemplateRef.current[cacheKey];

        if (cachedData) {
            setTasteCharacteristics(cachedData);
            return;
        }

        const response = await wineService.getTastesCharacteristics({
            typeId: selectedTypeId,
            colorId: selectedColorId,
        });

        if (!response.isError && response.data) {
            tasteCharacteristicsByTemplateRef.current[cacheKey] = response.data;
            setTasteCharacteristics(response.data);
        }
    }, [selectedColorId, selectedTypeId]);

    useEffect(() => {
        let isActive = true;

        const syncModeData = async () => {
            try {
                setIsInitialLoading(true);
                await loadBaseOptions();

                if (!isActive) {
                    return;
                }

                const savedFilters = getModeFilters(mode);

                if (!isFiltersPristine(savedFilters)) {
                    setFilters(cloneFilters(savedFilters));
                    return;
                }

                if (mode === 'friend') {
                    setFilters(cloneEmptyFilters());
                    return;
                }

                const prefillFilters = await loadPrefill();

                if (!isActive) {
                    return;
                }

                if (prefillFilters) {
                    setFilters(prefillFilters);
                    saveModeFilters('myself', prefillFilters);
                }
            } finally {
                if (isActive) {
                    setIsInitialLoading(false);
                }
            }
        };

        syncModeData();

        return () => {
            isActive = false;
        };
    }, [loadBaseOptions, loadPrefill, mode]);

    useEffect(() => {
        return () => {
            saveModeFilters('myself', cloneEmptyFilters());
            saveModeFilters('friend', cloneEmptyFilters());
        };
    }, []);

    useEffect(() => {
        loadTasteCharacteristics();
    }, [loadTasteCharacteristics]);

    useEffect(() => {
        if (!selectedCountryId) {
            setRegions(prevState => (prevState.length > 0 ? [] : prevState));
            return;
        }

        loadRegionsByCountryId(selectedCountryId);
    }, [loadRegionsByCountryId, selectedCountryId]);

    useEffect(() => {
        if (!selectedTypeId || !selectedColorId) {
            setAromas(prevState => (prevState.length > 0 ? [] : prevState));
            setFlavors(prevState => (prevState.length > 0 ? [] : prevState));
            return;
        }

        const cacheKey = `${selectedTypeId}:${selectedColorId}`;
        const cachedData = aromasFlavorsByTemplateRef.current[cacheKey];

        if (cachedData) {
            setAromas(cachedData.aromas);
            setFlavors(cachedData.flavors);
            return;
        }

        setAromas(prevState => (prevState.length > 0 ? [] : prevState));
        setFlavors(prevState => (prevState.length > 0 ? [] : prevState));
    }, [selectedColorId, selectedTypeId]);

    useEffect(() => {
        if (!selectedCountryId && filters.regionIds.length > 0) {
            patchFilters({ regionIds: [] });
        }
    }, [filters.regionIds.length, patchFilters, selectedCountryId]);

    const selectedTypes = useMemo(() => {
        return types.filter(item => filters.typeIds.includes(item.id));
    }, [filters.typeIds, types]);

    const selectedColors = useMemo(() => {
        return colors.filter(item => filters.colorIds.includes(item.id));
    }, [colors, filters.colorIds]);

    const selectedCountries = useMemo(() => {
        return countries.filter(item => filters.countryIds.includes(item.id));
    }, [countries, filters.countryIds]);

    const selectedRegions = useMemo(() => {
        return regions.filter(item => filters.regionIds.includes(item.id));
    }, [filters.regionIds, regions]);

    const selectedAromas = useMemo(() => {
        return aromas.filter(item => filters.aromaIds.includes(item.id));
    }, [aromas, filters.aromaIds]);

    const selectedFlavors = useMemo(() => {
        return flavors.filter(item => filters.flavorIds.includes(item.id));
    }, [filters.flavorIds, flavors]);

    const selectedGrapeVarieties = useMemo(() => {
        return filters.grapeVarieties.map(item => ({ name: item }));
    }, [filters.grapeVarieties]);

    const selectedVintageLabel = useMemo(() => {
        if (!filters.vintageMin || !filters.vintageMax) {
            return '';
        }

        if (filters.vintageMin === filters.vintageMax) {
            return `${filters.vintageMin}`;
        }

        return `${filters.vintageMin} - ${filters.vintageMax}`;
    }, [filters.vintageMax, filters.vintageMin]);

    const createSingleNumberToggle = useCallback((field: 'typeIds' | 'colorIds' | 'countryIds' | 'regionIds', id: number) => {
        return () => {
            const currentValue = filters[field][0];
            const nextValue = currentValue === id ? [] : [id];
            const payload: Partial<IWineChooserFilters> = { [field]: nextValue };

            if (field === 'countryIds') {
                payload.regionIds = [];
                setRegions([]);
            }

            if (field === 'typeIds' || field === 'colorIds') {
                payload.aromaIds = [];
                payload.flavorIds = [];
                setAromas([]);
                setFlavors([]);
            }

            patchFilters(payload);
        };
    }, [filters, patchFilters]);

    const createMultiNumberToggle = useCallback((field: 'aromaIds' | 'flavorIds', id: number) => {
        return () => {
            const values = filters[field];
            const nextValue = values.includes(id) ? values.filter(item => item !== id) : [...values, id];
            patchFilters({ [field]: nextValue });
        };
    }, [filters, patchFilters]);

    const createGrapeToggle = useCallback((name: string) => {
        return () => {
            const nextValue = filters.grapeVarieties.includes(name)
                ? filters.grapeVarieties.filter(item => item !== name)
                : [...filters.grapeVarieties, name];
            patchFilters({ grapeVarieties: nextValue });
        };
    }, [filters.grapeVarieties, patchFilters]);

    const createVintageToggle = useCallback((year: number) => {
        return () => {
            const nextValue = filters.vintageMin === year && filters.vintageMax === year
                ? { vintageMin: null, vintageMax: null }
                : { vintageMin: year, vintageMax: year };

            patchFilters(nextValue);
        };
    }, [filters.vintageMax, filters.vintageMin, patchFilters]);

    const mapNumberOptions = useCallback((
        items: IWineChooserOption[],
        selectedIds: number[],
        field: 'countryIds' | 'regionIds' | 'aromaIds' | 'flavorIds',
    ): IUniversalPickerOption[] => {
        return items.map(item => {
            const onPress = field === 'aromaIds' || field === 'flavorIds'
                ? createMultiNumberToggle(field, item.id)
                : createSingleNumberToggle(field, item.id);

            return {
                id: `${item.id}`,
                title: item.name,
                subtitle: createCountSubtitle(item.wineCount),
                isSelected: selectedIds.includes(item.id),
                onPress,
            };
        });
    }, [createMultiNumberToggle, createSingleNumberToggle]);

    const typeOptions = useMemo<IUniversalPickerOption[]>(() => {
        return types.map(item => {
            return {
                id: `${item.id}`,
                title: item.name,
                isSelected: filters.typeIds.includes(item.id),
                onPress: createSingleNumberToggle('typeIds', item.id),
            };
        });
    }, [createSingleNumberToggle, filters.typeIds, types]);

    const colorOptions = useMemo<IUniversalPickerOption[]>(() => {
        return colors.map(item => {
            return {
                id: `${item.id}`,
                title: item.name,
                isSelected: filters.colorIds.includes(item.id),
                onPress: createSingleNumberToggle('colorIds', item.id),
            };
        });
    }, [colors, createSingleNumberToggle, filters.colorIds]);

    const countryOptions = useMemo(() => {
        return mapNumberOptions(countries, filters.countryIds, 'countryIds');
    }, [countries, filters.countryIds, mapNumberOptions]);

    const regionOptions = useMemo(() => {
        return mapNumberOptions(regions, filters.regionIds, 'regionIds');
    }, [filters.regionIds, mapNumberOptions, regions]);

    const aromaOptions = useMemo(() => {
        return mapNumberOptions(aromas, filters.aromaIds, 'aromaIds');
    }, [aromas, filters.aromaIds, mapNumberOptions]);

    const flavorOptions = useMemo(() => {
        return mapNumberOptions(flavors, filters.flavorIds, 'flavorIds');
    }, [filters.flavorIds, flavors, mapNumberOptions]);

    const grapeOptions = useMemo<IUniversalPickerOption[]>(() => {
        return grapeVarieties.map(item => {
            const name = getGrapeVarietyName(item);

            return {
                id: name,
                title: name,
                subtitle: createCountSubtitle(item.wineCount),
                isSelected: filters.grapeVarieties.includes(name),
                onPress: createGrapeToggle(name),
            };
        }).filter(item => item.title);
    }, [createGrapeToggle, filters.grapeVarieties, grapeVarieties]);

    const vintageOptions = useMemo<IUniversalPickerOption[]>(() => {
        return Array.from({ length: VINTAGE_MAX - VINTAGE_MIN + 1 }).map((_, index) => {
            const year = VINTAGE_MAX - index;

            return {
                id: `${year}`,
                title: `${year}`,
                isSelected: filters.vintageMin === year && filters.vintageMax === year,
                onPress: createVintageToggle(year),
            };
        });
    }, [createVintageToggle, filters.vintageMax, filters.vintageMin]);

    const getPickerState = useCallback((key: WineChooserPickerKey): IWineChooserPickerState => {
        if (key === 'type') {
            return {
                key,
                title: localization.t('chooseWine.typeWine'),
                options: typeOptions,
                isLoading: loadingPickerKey === key,
                selectionMode: 'single',
            };
        }

        if (key === 'color') {
            return {
                key,
                title: localization.t('chooseWine.colorWine'),
                options: colorOptions,
                isLoading: loadingPickerKey === key,
                selectionMode: 'single',
            };
        }

        if (key === 'country') {
            return { key, title: localization.t('chooseWine.country'), options: countryOptions, isLoading: loadingPickerKey === key, selectionMode: 'single' };
        }

        if (key === 'region') {
            return { key, title: localization.t('chooseWine.region'), options: regionOptions, isLoading: loadingPickerKey === key, selectionMode: 'single' };
        }

        if (key === 'vintage') {
            return { key, title: localization.t('chooseWine.vintage'), options: vintageOptions, isLoading: loadingPickerKey === key, selectionMode: 'single' };
        }

        if (key === 'grape') {
            return { key, title: localization.t('chooseWine.grapeVariety'), options: grapeOptions, isLoading: loadingPickerKey === key, selectionMode: 'multiple' };
        }

        if (key === 'aroma') {
            return { key, title: localization.t('chooseWine.aroma'), options: aromaOptions, isLoading: loadingPickerKey === key, selectionMode: 'multiple' };
        }

        return { key, title: localization.t('chooseWine.taste'), options: flavorOptions, isLoading: loadingPickerKey === key, selectionMode: 'multiple' };
    }, [
        aromaOptions,
        colorOptions,
        countryOptions,
        flavorOptions,
        grapeOptions,
        loadingPickerKey,
        regionOptions,
        typeOptions,
        vintageOptions,
    ]);

    const openPicker = useCallback(async (key: WineChooserPickerKey) => {
        if (key === 'region' && !selectedCountryId) {
            return;
        }

        if ((key === 'aroma' || key === 'flavor') && (!selectedTypeId || !selectedColorId)) {
            return;
        }

        if (key === 'region' && regions.length === 0) {
            return;
        }

        if (key === 'grape' && grapeVarieties.length === 0) {
            await loadGrapeVarieties();
        } else if ((key === 'aroma' || key === 'flavor') && aromas.length === 0 && flavors.length === 0) {
            await loadAromasFlavors();
        }

        const nextState = getPickerState(key);
        setPickerState(nextState);
    }, [
        aromas.length,
        flavors.length,
        getPickerState,
        grapeVarieties.length,
        loadAromasFlavors,
        loadGrapeVarieties,
        regions.length,
        selectedColorId,
        selectedCountryId,
        selectedTypeId,
    ]);

    const onOpenTypePicker = useCallback(() => {
        openPicker('type');
    }, [openPicker]);

    const onOpenColorPicker = useCallback(() => {
        openPicker('color');
    }, [openPicker]);

    const onOpenCountryPicker = useCallback(() => {
        openPicker('country');
    }, [openPicker]);

    const onOpenRegionPicker = useCallback(() => {
        openPicker('region');
    }, [openPicker]);

    const onOpenVintagePicker = useCallback(() => {
        openPicker('vintage');
    }, [openPicker]);

    const onOpenGrapePicker = useCallback(() => {
        openPicker('grape');
    }, [openPicker]);

    const onOpenAromaPicker = useCallback(() => {
        openPicker('aroma');
    }, [openPicker]);

    const onOpenFlavorPicker = useCallback(() => {
        openPicker('flavor');
    }, [openPicker]);

    const openedPickerKey = pickerState?.key;

    useEffect(() => {
        if (openedPickerKey) {
            setPickerState(getPickerState(openedPickerKey));
        }
    }, [getPickerState, openedPickerKey]);

    const onClosePicker = useCallback(() => {
        setPickerState(null);
    }, []);

    const onConfirmPicker = useCallback(() => {
        setPickerState(null);
    }, []);

    const onSelectFemale = useCallback(() => {
        const nextGender: WineChooserGender = filters.gender === 'female' ? null : 'female';
        patchFilters({ gender: nextGender });
    }, [filters.gender, patchFilters]);

    const onSelectMale = useCallback(() => {
        const nextGender: WineChooserGender = filters.gender === 'male' ? null : 'male';
        patchFilters({ gender: nextGender });
    }, [filters.gender, patchFilters]);

    const onSelectMyselfMode = useCallback(() => {
        if (mode === 'myself') {
            return;
        }

        setMode('myself');
    }, [mode]);

    const onSelectFriendMode = useCallback(() => {
        if (mode === 'friend') {
            return;
        }

        setMode('friend');
    }, [mode]);

    const onAgeRangeChange = useCallback((ageMin: number, ageMax: number) => {
        patchFilters({ ageMin, ageMax });
    }, [patchFilters]);

    const onExpertRatingRangeChange = useCallback((minExpertRating: number, maxExpertRating: number) => {
        patchFilters({ minExpertRating, maxExpertRating });
    }, [patchFilters]);

    const onUserRatingChange = useCallback((minUserRating: number) => {
        patchFilters({ minUserRating });
    }, [patchFilters]);

    const onToggleTasteCharacteristics = useCallback(() => {
        setApplyTasteCharacteristics(prevState => !prevState);
    }, []);

    const onTasteRangeChange = useCallback((characteristicId: number, minSortNumber: number, maxSortNumber: number) => {
        const nextTasteFilters = filters.tasteFilters.filter(item => item.characteristicId !== characteristicId);
        nextTasteFilters.push({ characteristicId, minSortNumber, maxSortNumber });
        patchFilters({ tasteFilters: nextTasteFilters });
    }, [filters.tasteFilters, patchFilters]);

    const createOnTasteRangeChange = useCallback((characteristicId: number) => {
        return (minSortNumber: number, maxSortNumber: number) => {
            onTasteRangeChange(characteristicId, minSortNumber, maxSortNumber);
        };
    }, [onTasteRangeChange]);

    const tasteItems = useMemo(() => {
        return tasteCharacteristics.map(item => {
            const currentFilter = filters.tasteFilters.find(filterItem => filterItem.characteristicId === item.id);
            const levels = item.levels || [];
            const maxValue = Math.max(levels.length, 1);
            const minSortNumber = Math.min(Math.max(currentFilter?.minSortNumber || 1, 1), maxValue);
            const maxSortNumber = Math.min(Math.max(currentFilter?.maxSortNumber || maxValue, minSortNumber), maxValue);

            return {
                id: item.id,
                title: item.name,
                description: item.description || '',
                colorHex: item.colorHex,
                inactiveColor: createInactiveTrackColor(item.colorHex),
                minSortNumber,
                maxSortNumber,
                minValue: 1,
                maxValue,
                labels: getTasteFilterLabels(levels, item.isTriple),
                onChange: createOnTasteRangeChange(item.id),
            };
        });
    }, [createOnTasteRangeChange, filters.tasteFilters, tasteCharacteristics]);

    const onApplyPress = useCallback(() => {
        setIsApplying(true);
        const nextFilters = applyTasteCharacteristics ? filters : { ...filters, tasteFilters: [] };
        saveModeFilters(mode, nextFilters);
        navigation.navigate('ChooseWineResultsView', { mode });
        setIsApplying(false);
    }, [applyTasteCharacteristics, filters, mode, navigation]);

    const isLoverRating = userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER;

    const userRatingHintText = useMemo(() => {
        if (!filters.minUserRating) {
            return localization.t('chooseWine.ratingScaleHint');
        }

        return `${filters.minUserRating.toFixed(1)} ${getRatingDescription(filters.minUserRating)}`;
    }, [filters.minUserRating]);

    return {
        mode,
        filters,
        isInitialLoading,
        isApplying,
        pickerState,
        selectedTypeText: formatSelectedNames(selectedTypes),
        selectedColorText: formatSelectedNames(selectedColors),
        selectedCountryText: formatSelectedNames(selectedCountries),
        selectedRegionText: formatSelectedNames(selectedRegions),
        selectedAromaText: formatSelectedNames(selectedAromas),
        selectedFlavorText: formatSelectedNames(selectedFlavors),
        selectedGrapeText: formatSelectedNames(selectedGrapeVarieties),
        selectedVintageLabel,
        isRegionDisabled: !selectedCountryId || loadingPickerKey === 'region' || regions.length === 0,
        isAromaFlavorDisabled: !selectedTypeId || !selectedColorId,
        ageMin: filters.ageMin || AGE_MIN,
        ageMax: filters.ageMax || AGE_MAX,
        ratingMin: filters.minExpertRating,
        ratingMax: filters.maxExpertRating,
        userRating: filters.minUserRating,
        userRatingHintText,
        isLoverRating,
        constants: {
            AGE_MIN,
            AGE_MAX,
            RATING_MIN,
            RATING_MAX,
        },
        tasteItems,
        applyTasteCharacteristics,
        onSelectMyselfMode,
        onSelectFriendMode,
        onSelectFemale,
        onSelectMale,
        onAgeRangeChange,
        onExpertRatingRangeChange,
        onUserRatingChange,
        onToggleTasteCharacteristics,
        onOpenTypePicker,
        onOpenColorPicker,
        onOpenCountryPicker,
        onOpenRegionPicker,
        onOpenVintagePicker,
        onOpenGrapePicker,
        onOpenAromaPicker,
        onOpenFlavorPicker,
        onClosePicker,
        onConfirmPicker,
        onApplyPress,
    };
};
