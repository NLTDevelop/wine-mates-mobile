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
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IWineChooserPickerState, WineChooserPickerKey } from '../types/IWineChooserPicker';
import { IChooseWineTasteFilterLabel } from '../types/IChooseWineTasteFilterItem';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { IQuickFilterButtonItem } from '../types/IQuickFilterButtonItem';
import { useChooseWineAromasFlavors } from './useChooseWineAromasFlavors';
import { useChooseWineBaseOptions } from './useChooseWineBaseOptions';
import { useChooseWineGrapeVarieties } from './useChooseWineGrapeVarieties';
import { useChooseWineRegions } from './useChooseWineRegions';
import { useChooseWineTasteCharacteristics } from './useChooseWineTasteCharacteristics';
import { useChooseWineVintages } from './useChooseWineVintages';

type RouteParams = {
    ChooseWineFiltersView: {
        mode: WineChooserMode;
    };
};

type LegacyWineChooserFilters = IWineChooserFilters & {
    vintageMin?: number | null;
    vintageMax?: number | null;
};

const AGE_MIN = 18;
const AGE_MAX = 100;
const RATING_MIN = 70;
const RATING_MAX = 100;
const QUICK_FILTER_LIMIT = 5;

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
        vintages: [],
        tasteFilters: [],
    };
};

const cloneFilters = (filters: IWineChooserFilters): IWineChooserFilters => {
    const restFilters = { ...filters } as LegacyWineChooserFilters;
    delete restFilters.vintageMin;
    delete restFilters.vintageMax;

    return {
        ...restFilters,
        aromaIds: [...filters.aromaIds],
        flavorIds: [...filters.flavorIds],
        typeIds: [...filters.typeIds],
        colorIds: [...filters.colorIds],
        countryIds: [...filters.countryIds],
        regionIds: [...filters.regionIds],
        grapeVarieties: [...filters.grapeVarieties],
        vintages: [...(filters.vintages || [])],
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
        (filters.vintages || []).length === 0 &&
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

const createQuickFilterTitle = (name: string, wineCount?: number) => {
    if (typeof wineCount !== 'number') {
        return name;
    }

    return `${name} (${wineCount})`;
};

const getSelectedOptionIds = (options: IUniversalPickerOption[]) => {
    return options.filter(item => item.isSelected).map(item => item.id);
};

const getSelectedNumberOptionIds = (options: IUniversalPickerOption[]) => {
    return getSelectedOptionIds(options)
        .map(item => Number(item))
        .filter(item => Number.isFinite(item));
};

const getGrapeVarietyName = (item: IWineChooserGrapeVariety) => {
    return item.grapeVariety || item.name || '';
};

const getVintageTitle = (value: number | null) => {
    if (value === null) {
        return localization.t('wine.nonVintage');
    }

    return `${value}`;
};

const getPrefillGender = (value?: WineChooserGender) => {
    if (value === 'male' || value === 'female') {
        return value;
    }

    return null;
};

const getPrefillAge = (value?: number | null) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    return null;
};

const getPrefillGrapeVarieties = (value?: string | null) => {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return [];
    }

    return [trimmedValue];
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

const getAllowedTasteFilters = (
    filters: IWineChooserFilters,
    shouldApplyTasteCharacteristics: boolean,
): IWineChooserFilters => {
    if (shouldApplyTasteCharacteristics) {
        return filters;
    }

    return {
        ...filters,
        tasteFilters: [],
    };
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
    const myselfPrefillLoadedRef = useRef(false);

    const [filters, setFilters] = useState<IWineChooserFilters>(() => {
        const savedFilters = getModeFilters(mode);

        if (isFiltersPristine(savedFilters)) {
            return cloneEmptyFilters();
        }

        return cloneFilters(savedFilters);
    });
    const [isInitialLoading, setIsInitialLoading] = useState(mode === 'myself');
    const [isApplying, setIsApplying] = useState(false);
    const [loadingPickerKey, setLoadingPickerKey] = useState<WineChooserPickerKey | null>(null);
    const [pickerState, setPickerState] = useState<IWineChooserPickerState | null>(null);
    const [applyTasteCharacteristics, setApplyTasteCharacteristics] = useState(false);
    const isPremiumUser = userModel.user?.hasPremium || false;
    const isTasteCharacteristicsLocked = !isPremiumUser;

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

    const { types, colors, countries, loadBaseOptions } = useChooseWineBaseOptions();
    const { regions, setRegions, loadRegionsByCountryId } = useChooseWineRegions({
        showLoadError,
        setLoadingPickerKey,
    });
    const { grapeVarieties, loadGrapeVarieties } = useChooseWineGrapeVarieties({
        showLoadError,
        setLoadingPickerKey,
    });
    const { vintages, loadVintages } = useChooseWineVintages({
        showLoadError,
        setLoadingPickerKey,
    });
    const {
        aromas,
        flavors,
        setAromas,
        setFlavors,
        loadAromasFlavors,
        syncAromasFlavorsForTemplate,
    } = useChooseWineAromasFlavors({
        selectedTypeId,
        selectedColorId,
        showLoadError,
        setLoadingPickerKey,
    });
    const { tasteCharacteristics, loadTasteCharacteristics } = useChooseWineTasteCharacteristics({
        selectedTypeId,
        selectedColorId,
    });

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
            gender: getPrefillGender(response.data.gender),
            ageMin: getPrefillAge(response.data.ageMin),
            ageMax: getPrefillAge(response.data.ageMax),
            grapeVarieties: getPrefillGrapeVarieties(response.data.grapeVariety),
            tasteFilters: isPremiumUser
                ? (response.data.tasteCharacteristics || []).map(item => {
                    return {
                        characteristicId: item.characteristicId,
                        minSortNumber: Math.max(1, item.avgSortNumber - 1),
                        maxSortNumber: Math.min(5, item.avgSortNumber + 1),
                    };
                })
                : [],
        };

        return nextFilters;
    }, [isPremiumUser, mode, showLoadError]);

    useEffect(() => {
        let isActive = true;

        const syncModeData = async () => {
            try {
                setIsInitialLoading(true);
                await Promise.all([
                    loadBaseOptions(),
                    loadGrapeVarieties(),
                    loadVintages(),
                ]);

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
    }, [loadBaseOptions, loadGrapeVarieties, loadPrefill, loadVintages, mode]);

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
    }, [loadRegionsByCountryId, selectedCountryId, setRegions]);

    useEffect(() => {
        syncAromasFlavorsForTemplate();
    }, [syncAromasFlavorsForTemplate]);

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
        if (filters.vintages.length === 0) {
            return '';
        }

        return filters.vintages.map(getVintageTitle).join(', ');
    }, [filters.vintages]);

    const createPickerOptionToggle = useCallback((id: string) => {
        return () => {
            setPickerState(currentState => {
                if (!currentState) {
                    return currentState;
                }

                const isSingleSelection = currentState.selectionMode === 'single';
                const currentOption = currentState.options.find(item => item.id === id);
                const shouldSelectSingleOption = isSingleSelection && !currentOption?.isSelected;

                return {
                    ...currentState,
                    options: currentState.options.map(item => {
                        if (isSingleSelection) {
                            return {
                                ...item,
                                isSelected: shouldSelectSingleOption && item.id === id,
                            };
                        }

                        if (item.id !== id) {
                            return item;
                        }

                        return {
                            ...item,
                            isSelected: !item.isSelected,
                        };
                    }),
                };
            });
        };
    }, []);

    const mapNumberOptions = useCallback((
        items: IWineChooserOption[],
        selectedIds: number[],
    ): IUniversalPickerOption[] => {
        return items.map(item => {
            return {
                id: `${item.id}`,
                title: item.name,
                subtitle: createCountSubtitle(item.wineCount),
                isSelected: selectedIds.includes(item.id),
                onPress: createPickerOptionToggle(`${item.id}`),
            };
        });
    }, [createPickerOptionToggle]);

    const typeOptions = useMemo<IUniversalPickerOption[]>(() => {
        return types.map(item => {
            return {
                id: `${item.id}`,
                title: item.name,
                isSelected: filters.typeIds.includes(item.id),
                onPress: createPickerOptionToggle(`${item.id}`),
            };
        });
    }, [createPickerOptionToggle, filters.typeIds, types]);

    const colorOptions = useMemo<IUniversalPickerOption[]>(() => {
        return colors.map(item => {
            return {
                id: `${item.id}`,
                title: item.name,
                isSelected: filters.colorIds.includes(item.id),
                onPress: createPickerOptionToggle(`${item.id}`),
            };
        });
    }, [colors, createPickerOptionToggle, filters.colorIds]);

    const countryOptions = useMemo(() => {
        return mapNumberOptions(countries, filters.countryIds);
    }, [countries, filters.countryIds, mapNumberOptions]);

    const regionOptions = useMemo(() => {
        return mapNumberOptions(regions, filters.regionIds);
    }, [filters.regionIds, mapNumberOptions, regions]);

    const aromaOptions = useMemo(() => {
        return mapNumberOptions(aromas, filters.aromaIds);
    }, [aromas, filters.aromaIds, mapNumberOptions]);

    const flavorOptions = useMemo(() => {
        return mapNumberOptions(flavors, filters.flavorIds);
    }, [filters.flavorIds, flavors, mapNumberOptions]);

    const grapeOptions = useMemo<IUniversalPickerOption[]>(() => {
        return grapeVarieties.map(item => {
            const name = getGrapeVarietyName(item);

            return {
                id: name,
                title: name,
                subtitle: createCountSubtitle(item.wineCount),
                isSelected: filters.grapeVarieties.includes(name),
                onPress: createPickerOptionToggle(name),
            };
        }).filter(item => item.title);
    }, [createPickerOptionToggle, filters.grapeVarieties, grapeVarieties]);

    const vintageOptions = useMemo<IUniversalPickerOption[]>(() => {
        return vintages.map(item => {
            const vintage = item.vintage;
            const id = vintage === null ? 'null' : `${vintage}`;

            return {
                id,
                title: getVintageTitle(vintage),
                subtitle: createCountSubtitle(item.wineCount),
                isSelected: filters.vintages.includes(vintage),
                onPress: createPickerOptionToggle(id),
            };
        });
    }, [createPickerOptionToggle, filters.vintages, vintages]);

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
            return { key, title: localization.t('chooseWine.vintage'), options: vintageOptions, isLoading: loadingPickerKey === key, selectionMode: 'multiple' };
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
        } else if (key === 'vintage' && vintages.length === 0) {
            await loadVintages();
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
        loadVintages,
        regions.length,
        selectedColorId,
        selectedCountryId,
        selectedTypeId,
        vintages.length,
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

    const createOnQuickCountryPress = useCallback((countryId: number) => {
        return () => {
            const isSelected = filters.countryIds.includes(countryId);
            const countryIds = isSelected ? [] : [countryId];
            const payload: Partial<IWineChooserFilters> = { countryIds };

            if (filters.countryIds[0] !== countryIds[0]) {
                payload.regionIds = [];
                setRegions([]);
            }

            patchFilters(payload);
        };
    }, [filters.countryIds, patchFilters, setRegions]);

    const createOnQuickGrapePress = useCallback((grapeName: string) => {
        return () => {
            const nextGrapeVarieties = filters.grapeVarieties.includes(grapeName)
                ? filters.grapeVarieties.filter(item => item !== grapeName)
                : [...filters.grapeVarieties, grapeName];

            patchFilters({ grapeVarieties: nextGrapeVarieties });
        };
    }, [filters.grapeVarieties, patchFilters]);

    const createOnQuickVintagePress = useCallback((vintage: number | null) => {
        return () => {
            const nextVintages = filters.vintages.includes(vintage)
                ? filters.vintages.filter(item => item !== vintage)
                : [...filters.vintages, vintage];

            patchFilters({ vintages: nextVintages });
        };
    }, [filters.vintages, patchFilters]);

    const onOpenQuickCountryPicker = useCallback(() => {
        setPickerState(getPickerState('country'));
    }, [getPickerState]);

    const onOpenQuickGrapePicker = useCallback(() => {
        if (grapeVarieties.length === 0) {
            return;
        }

        setPickerState(getPickerState('grape'));
    }, [getPickerState, grapeVarieties.length]);

    const onOpenQuickVintagePicker = useCallback(() => {
        if (vintages.length === 0) {
            return;
        }

        setPickerState(getPickerState('vintage'));
    }, [getPickerState, vintages.length]);

    const quickCountryItems = useMemo<IQuickFilterButtonItem[]>(() => {
        const items = countries.slice(0, QUICK_FILTER_LIMIT).map<IQuickFilterButtonItem>(item => {
            return {
                id: `country-${item.id}`,
                title: createQuickFilterTitle(item.name, item.wineCount),
                isSelected: filters.countryIds.includes(item.id),
                onPress: createOnQuickCountryPress(item.id),
            };
        });

        if (countries.length > QUICK_FILTER_LIMIT) {
            items.push({
                id: 'country-more',
                title: `${localization.t('common.more')}...`,
                isSelected: false,
                isMore: true,
                onPress: onOpenQuickCountryPicker,
            });
        }

        return items;
    }, [countries, createOnQuickCountryPress, filters.countryIds, onOpenQuickCountryPicker]);

    const quickGrapeItems = useMemo<IQuickFilterButtonItem[]>(() => {
        const items = grapeVarieties.slice(0, QUICK_FILTER_LIMIT).map<IQuickFilterButtonItem>(item => {
            const name = getGrapeVarietyName(item);

            return {
                id: `grape-${name}`,
                title: createQuickFilterTitle(name, item.wineCount),
                isSelected: filters.grapeVarieties.includes(name),
                onPress: createOnQuickGrapePress(name),
            };
        }).filter(item => item.title);

        if (grapeVarieties.length > QUICK_FILTER_LIMIT) {
            items.push({
                id: 'grape-more',
                title: `${localization.t('common.more')}...`,
                isSelected: false,
                isMore: true,
                onPress: onOpenQuickGrapePicker,
            });
        }

        return items;
    }, [createOnQuickGrapePress, filters.grapeVarieties, grapeVarieties, onOpenQuickGrapePicker]);

    const quickVintageItems = useMemo<IQuickFilterButtonItem[]>(() => {
        const items = vintages.slice(0, QUICK_FILTER_LIMIT).map<IQuickFilterButtonItem>(item => {
            const vintage = item.vintage;
            const id = vintage === null ? 'null' : `${vintage}`;

            return {
                id: `vintage-${id}`,
                title: createQuickFilterTitle(getVintageTitle(vintage), item.wineCount),
                isSelected: filters.vintages.includes(vintage),
                onPress: createOnQuickVintagePress(vintage),
            };
        });

        if (vintages.length > QUICK_FILTER_LIMIT) {
            items.push({
                id: 'vintage-more',
                title: `${localization.t('common.more')}...`,
                isSelected: false,
                isMore: true,
                onPress: onOpenQuickVintagePicker,
            });
        }

        return items;
    }, [createOnQuickVintagePress, filters.vintages, onOpenQuickVintagePicker, vintages]);

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
        if (!pickerState) {
            return;
        }

        if (pickerState.key === 'type') {
            const typeIds = getSelectedNumberOptionIds(pickerState.options);
            const payload: Partial<IWineChooserFilters> = { typeIds };

            if (filters.typeIds[0] !== typeIds[0]) {
                payload.aromaIds = [];
                payload.flavorIds = [];
                setAromas([]);
                setFlavors([]);
            }

            patchFilters(payload);
            setPickerState(null);
            return;
        }

        if (pickerState.key === 'color') {
            const colorIds = getSelectedNumberOptionIds(pickerState.options);
            const payload: Partial<IWineChooserFilters> = { colorIds };

            if (filters.colorIds[0] !== colorIds[0]) {
                payload.aromaIds = [];
                payload.flavorIds = [];
                setAromas([]);
                setFlavors([]);
            }

            patchFilters(payload);
            setPickerState(null);
            return;
        }

        if (pickerState.key === 'country') {
            const countryIds = getSelectedNumberOptionIds(pickerState.options);
            const payload: Partial<IWineChooserFilters> = { countryIds };

            if (filters.countryIds[0] !== countryIds[0]) {
                payload.regionIds = [];
                setRegions([]);
            }

            patchFilters(payload);
            setPickerState(null);
            return;
        }

        if (pickerState.key === 'region') {
            patchFilters({ regionIds: getSelectedNumberOptionIds(pickerState.options) });
            setPickerState(null);
            return;
        }

        if (pickerState.key === 'vintage') {
            const selectedVintages = getSelectedOptionIds(pickerState.options).map(item => {
                if (item === 'null') {
                    return null;
                }

                return Number(item);
            }).filter((item): item is number | null => item === null || Number.isFinite(item));

            patchFilters({ vintages: selectedVintages });
            setPickerState(null);
            return;
        }

        if (pickerState.key === 'grape') {
            patchFilters({ grapeVarieties: getSelectedOptionIds(pickerState.options) });
            setPickerState(null);
            return;
        }

        if (pickerState.key === 'aroma') {
            patchFilters({ aromaIds: getSelectedNumberOptionIds(pickerState.options) });
            setPickerState(null);
            return;
        }

        patchFilters({ flavorIds: getSelectedNumberOptionIds(pickerState.options) });
        setPickerState(null);
    }, [filters.colorIds, filters.countryIds, filters.typeIds, patchFilters, pickerState, setAromas, setFlavors, setRegions]);

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
                isLocked: isTasteCharacteristicsLocked,
                onChange: createOnTasteRangeChange(item.id),
            };
        });
    }, [createOnTasteRangeChange, filters.tasteFilters, isTasteCharacteristicsLocked, tasteCharacteristics]);

    const visibleTasteItems = useMemo(() => {
        return applyTasteCharacteristics ? tasteItems : [];
    }, [applyTasteCharacteristics, tasteItems]);

    const shouldShowTasteCharacteristicsToggle = tasteItems.length > 0;

    const onApplyPress = useCallback(() => {
        setIsApplying(true);
        const shouldApplyTasteFilters = applyTasteCharacteristics && !isTasteCharacteristicsLocked;
        const nextFilters = getAllowedTasteFilters(filters, shouldApplyTasteFilters);
        setFilters(nextFilters);
        saveModeFilters(mode, nextFilters);
        navigation.navigate('ChooseWineResultsView', { mode });
        setIsApplying(false);
    }, [applyTasteCharacteristics, filters, isTasteCharacteristicsLocked, mode, navigation]);

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
        visibleTasteItems,
        quickCountryItems,
        quickGrapeItems,
        quickVintageItems,
        shouldShowTasteCharacteristicsToggle,
        applyTasteCharacteristics,
        isTasteCharacteristicsLocked,
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
