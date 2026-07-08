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
    IWineChooserFilterOptionTasteCharacteristic,
    IGenderOption,
    IWineChooserFilterOptions,
    IWineChooserFilterOptionsRequest,
    IWineChooserGrapeVariety,
    IWineChooserOption,
    IWineChooserTasteFilter,
    IWineChooserVintage,
    WineChooserGender,
    WineChooserMode,
} from '@/entities/wine/types/IWineChooser';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { IWineChooserPickerState, WineChooserPickerKey } from '../types/IWineChooserPicker';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { IQuickFilterButtonItem } from '../types/IQuickFilterButtonItem';
import { useChooseWineFilterOptions } from './useChooseWineFilterOptions';
import { useDebounce } from '@/hooks/useDebounce';
import { declOfWord } from '@/utils';

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
const TASTE_FILTER_MIN = 1;
const TASTE_FILTER_MAX = 10;

interface IDisabledFilterState {
    isExpertRatingDisabled: boolean;
    isAgeDisabled: boolean;
    isFemaleGenderDisabled: boolean;
    isMaleGenderDisabled: boolean;
}

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
    return (
        !filters.searchQuery &&
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
        filters.maxExpertRating === EMPTY_WINE_CHOOSER_FILTERS.maxExpertRating
    );
};

const isExpertRatingFilterAvailable = (filters: Pick<IWineChooserFilters, 'minExpertRating' | 'maxExpertRating'>) => {
    return (
        filters.minExpertRating >= RATING_MIN &&
        filters.maxExpertRating <= RATING_MAX &&
        filters.maxExpertRating >= filters.minExpertRating
    );
};

const isAgeRangeFilterAvailable = (ageRange?: { minAge: number; maxAge: number }) => {
    return !!ageRange && Math.round(ageRange.maxAge) > 0;
};

const getRoundedAgeRange = (ageRange?: { minAge: number; maxAge: number }) => {
    if (!isAgeRangeFilterAvailable(ageRange)) {
        return {
            minAge: AGE_MIN,
            maxAge: AGE_MAX,
        };
    }

    return {
        minAge: Math.round(ageRange?.minAge || AGE_MIN),
        maxAge: Math.round(ageRange?.maxAge || AGE_MAX),
    };
};

const getExpertRatingRange = (filterOptions: IWineChooserFilterOptions) => {
    const minExpertRating = filterOptions.ratings?.minExpertRating ?? RATING_MIN;
    const maxExpertRating = filterOptions.ratings?.maxExpertRating ?? RATING_MAX;

    if (!isExpertRatingFilterAvailable({ minExpertRating, maxExpertRating })) {
        return {
            minExpertRating: RATING_MIN,
            maxExpertRating: RATING_MAX,
        };
    }

    return {
        minExpertRating,
        maxExpertRating,
    };
};

const isExpertRatingSelected = (
    filters: IWineChooserFilters,
    filterOptions: IWineChooserFilterOptions,
) => {
    if (
        filters.minExpertRating === EMPTY_WINE_CHOOSER_FILTERS.minExpertRating &&
        filters.maxExpertRating === EMPTY_WINE_CHOOSER_FILTERS.maxExpertRating
    ) {
        return false;
    }

    const minExpertRating = filterOptions.ratings?.minExpertRating ?? 0;
    const maxExpertRating = filterOptions.ratings?.maxExpertRating ?? 0;

    if (!isExpertRatingFilterAvailable({ minExpertRating, maxExpertRating })) {
        return false;
    }

    const ratingRange = getExpertRatingRange(filterOptions);

    return filters.minExpertRating !== ratingRange.minExpertRating ||
        filters.maxExpertRating !== ratingRange.maxExpertRating;
};

const isGenderOptionAvailable = (genderOptions: IGenderOption[], gender: Exclude<WineChooserGender, null>) => {
    return genderOptions.some(item => item.value === gender);
};

const createFilterOptionsRequest = (filters: IWineChooserFilters, shouldApplyTasteFilters: boolean) => {
    if (isFiltersPristine(filters)) {
        return {};
    }

    const request = cloneFilters(filters);

    if (!shouldApplyTasteFilters) {
        request.tasteFilters = [];
    }

    return request;
};

const removeDisabledFiltersFromRequest = (
    request: IWineChooserFilterOptionsRequest,
    filters: IWineChooserFilters,
    disabledState: IDisabledFilterState,
): IWineChooserFilterOptionsRequest => {
    const nextRequest = { ...request };

    if (disabledState.isExpertRatingDisabled) {
        delete nextRequest.minExpertRating;
        delete nextRequest.maxExpertRating;
    }

    if (disabledState.isAgeDisabled) {
        delete nextRequest.ageMin;
        delete nextRequest.ageMax;
    }

    if (
        (filters.gender === 'female' && disabledState.isFemaleGenderDisabled) ||
        (filters.gender === 'male' && disabledState.isMaleGenderDisabled)
    ) {
        delete nextRequest.gender;
    }

    return nextRequest;
};

const removeInactiveRatingFieldsFromRequest = (
    request: IWineChooserFilterOptionsRequest,
    filters: IWineChooserFilters,
    filterOptions: IWineChooserFilterOptions,
    isLoverRating: boolean,
): IWineChooserFilterOptionsRequest => {
    const nextRequest = { ...request };

    if (isLoverRating) {
        delete nextRequest.minExpertRating;
        delete nextRequest.maxExpertRating;

        if (filters.minUserRating <= 0) {
            delete nextRequest.minUserRating;
        }

        return nextRequest;
    }

    delete nextRequest.minUserRating;

    if (!isExpertRatingSelected(filters, filterOptions)) {
        delete nextRequest.minExpertRating;
        delete nextRequest.maxExpertRating;
    }

    return nextRequest;
};

const removeEmptyFiltersFromRequest = (
    request: IWineChooserFilterOptionsRequest,
): IWineChooserFilterOptionsRequest => {
    const nextRequest = { ...request };

    if (!nextRequest.searchQuery) {
        delete nextRequest.searchQuery;
    }

    if (nextRequest.gender === null) {
        delete nextRequest.gender;
    }

    if (nextRequest.ageMin === null) {
        delete nextRequest.ageMin;
    }

    if (nextRequest.ageMax === null) {
        delete nextRequest.ageMax;
    }

    if (nextRequest.aromaIds?.length === 0) {
        delete nextRequest.aromaIds;
    }

    if (nextRequest.flavorIds?.length === 0) {
        delete nextRequest.flavorIds;
    }

    if (nextRequest.typeIds?.length === 0) {
        delete nextRequest.typeIds;
    }

    if (nextRequest.colorIds?.length === 0) {
        delete nextRequest.colorIds;
    }

    if (nextRequest.countryIds?.length === 0) {
        delete nextRequest.countryIds;
    }

    if (nextRequest.regionIds?.length === 0) {
        delete nextRequest.regionIds;
    }

    if (nextRequest.grapeVarieties?.length === 0) {
        delete nextRequest.grapeVarieties;
    }

    if (nextRequest.vintages?.length === 0) {
        delete nextRequest.vintages;
    }

    if (nextRequest.tasteFilters?.length === 0) {
        delete nextRequest.tasteFilters;
    }

    return nextRequest;
};

const getDisabledFilterState = (
    filters: IWineChooserFilters,
    filterOptions: IWineChooserFilterOptions,
): IDisabledFilterState => {
    const ratings = filterOptions.ratings;
    const isFilterOptionsExpertRatingAvailable = isExpertRatingFilterAvailable({
        minExpertRating: ratings?.minExpertRating ?? 0,
        maxExpertRating: ratings?.maxExpertRating ?? 0,
    });

    return {
        isExpertRatingDisabled: !isExpertRatingFilterAvailable(filters) || !isFilterOptionsExpertRatingAvailable,
        isAgeDisabled: !isAgeRangeFilterAvailable(filterOptions.ageRange),
        isFemaleGenderDisabled: !isGenderOptionAvailable(filterOptions.genderOptions || [], 'female'),
        isMaleGenderDisabled: !isGenderOptionAvailable(filterOptions.genderOptions || [], 'male'),
    };
};

const formatSelectedNames = (items: { name: string }[], fallback = '') => {
    if (items.length === 0) {
        return fallback;
    }

    return items.map(item => item.name).join(', ');
};

const createWineCountText = (wineCount: number) => {
    return declOfWord(wineCount, localization.t('chooseWine.wineCount') as unknown as Array<string>);
};

const createCountSubtitle = (wineCount?: number) => {
    if (typeof wineCount !== 'number') {
        return undefined;
    }

    return createWineCountText(wineCount);
};

const createWineCountBadgeText = (wineCount?: number) => {
    if (typeof wineCount !== 'number') {
        return '';
    }

    return `(${createWineCountText(wineCount)})`;
};

const areNumberArraysEqual = (leftItems: number[], rightItems: number[]) => {
    if (leftItems.length !== rightItems.length) {
        return false;
    }

    return leftItems.every(item => rightItems.includes(item));
};

const getSelectedOptionIds = (options: IUniversalPickerOption[]) => {
    return options.filter(item => item.isSelected).map(item => item.id);
};

const getSelectedNumberOptionIds = (options: IUniversalPickerOption[]) => {
    return getSelectedOptionIds(options)
        .map(item => Number(item))
        .filter(item => Number.isFinite(item));
};

const getGrapeVarietyName = (item: { grapeVariety?: string; name?: string }) => {
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

const mapFilterOptionVintages = (vintages: { id: number | null; wineCount?: number }[]): IWineChooserVintage[] => {
    return vintages.map(item => {
        return {
            vintage: item.id,
            wineCount: item.wineCount || 0,
        };
    });
};

const cacheNumberOptions = (cache: Record<number, IWineChooserOption>, items: IWineChooserOption[]) => {
    items.forEach(item => {
        cache[item.id] = item;
    });
};

const getOptionsWithSelected = (
    items: IWineChooserOption[],
    selectedIds: number[],
    cache: Record<number, IWineChooserOption>,
) => {
    const optionsById = new Map(items.map(item => [item.id, item]));
    const selectedItems = selectedIds
        .map(id => optionsById.get(id) || cache[id])
        .filter((item): item is IWineChooserOption => !!item);
    const nextItems = [...items];

    selectedItems.forEach(item => {
        if (!optionsById.has(item.id)) {
            nextItems.push(item);
        }
    });

    return nextItems;
};

const filterExistingNumberIds = (ids: number[], items: IWineChooserOption[]) => {
    const itemIds = items.map(item => item.id);
    return ids.filter(id => itemIds.includes(id));
};

const filterExistingGrapeVarieties = (grapeVarieties: string[], items: { grapeVariety?: string; name?: string }[]) => {
    const names = items.map(getGrapeVarietyName).filter(Boolean);
    return grapeVarieties.filter(item => names.includes(item));
};

const filterExistingVintages = (vintages: (number | null)[], items: IWineChooserVintage[]) => {
    const itemVintages = items.map(item => item.vintage);
    return vintages.filter(item => itemVintages.includes(item));
};

const createTasteFiltersFromCharacteristics = (
    items: IWineChooserFilterOptionTasteCharacteristic[],
): IWineChooserTasteFilter[] => {
    return items.map(item => {
        const minSortNumber = Math.min(Math.max(item.minSortNumber, TASTE_FILTER_MIN), TASTE_FILTER_MAX);
        const maxSortNumber = Math.min(Math.max(item.maxSortNumber, minSortNumber), TASTE_FILTER_MAX);

        return {
            characteristicId: item.id,
            minSortNumber,
            maxSortNumber,
        };
    });
};

export const useChooseWineFilters = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteParams, 'ChooseWineFiltersView'>>();
    const routeMode = route.params?.mode || 'friend';
    const [mode, setMode] = useState<WineChooserMode>(routeMode);
    const myselfPrefillLoadedRef = useRef(false);
    const isSyncingModeDataRef = useRef(false);
    const shouldSkipNextFilterOptionsSyncRef = useRef(false);
    const isUserRatingInteractingRef = useRef(false);
    const lastFilterOptionsRequestKeyRef = useRef('');

    const [filters, setFilters] = useState<IWineChooserFilters>(() => {
        const savedFilters = getModeFilters(mode);

        if (isFiltersPristine(savedFilters)) {
            return cloneEmptyFilters();
        }

        return cloneFilters(savedFilters);
    });
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [loadingPickerKey] = useState<WineChooserPickerKey | null>(null);
    const [pickerState, setPickerState] = useState<IWineChooserPickerState | null>(null);
    const [applyTasteCharacteristics, setApplyTasteCharacteristics] = useState(false);
    const [typeOptionsCache, setTypeOptionsCache] = useState<Record<number, IWineChooserOption>>({});
    const [colorOptionsCache, setColorOptionsCache] = useState<Record<number, IWineChooserOption>>({});
    const [countryOptionsCache, setCountryOptionsCache] = useState<Record<number, IWineChooserOption>>({});
    const [regionOptionsCache, setRegionOptionsCache] = useState<Record<number, IWineChooserOption>>({});
    const [aromaOptionsCache, setAromaOptionsCache] = useState<Record<number, IWineChooserOption>>({});
    const [flavorOptionsCache, setFlavorOptionsCache] = useState<Record<number, IWineChooserOption>>({});
    const isPremiumUser = userModel.user?.hasPremium || false;
    const isTasteCharacteristicsLocked = !isPremiumUser;
    const isLoverRating = userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER;

    const patchFilters = useCallback(
        (payload: Partial<IWineChooserFilters>) => {
            setFilters(prevState => {
                const nextState = { ...prevState, ...payload };
                saveModeFilters(mode, nextState);
                return nextState;
            });
        },
        [mode],
    );

    const showLoadError = useCallback((message?: string) => {
        toastService.showError(
            localization.t('common.errorHappened'),
            message || localization.t('common.somethingWentWrong'),
        );
    }, []);

    const { filterOptions, loadFilterOptions } = useChooseWineFilterOptions({
        showLoadError
    });
    const latestFilterOptionsRef = useRef(filterOptions);

    useEffect(() => {
        latestFilterOptionsRef.current = filterOptions;
    }, [filterOptions]);

    const disabledFilterState = getDisabledFilterState(filters, filterOptions);
    const isExpertRatingDisabled = disabledFilterState.isExpertRatingDisabled;
    const expertRatingRange = getExpertRatingRange(filterOptions);
    const ageRange = getRoundedAgeRange(filterOptions.ageRange);
    const isAgeDisabled = disabledFilterState.isAgeDisabled;
    const genderOptions = filterOptions.genderOptions || [];
    const femaleGenderOption = genderOptions.find(item => item.value === 'female');
    const maleGenderOption = genderOptions.find(item => item.value === 'male');
    const isFemaleGenderDisabled = disabledFilterState.isFemaleGenderDisabled;
    const isMaleGenderDisabled = disabledFilterState.isMaleGenderDisabled;

    const loadActualFilterOptions = useCallback(
        async (actualFilters: IWineChooserFilters, shouldApplyTasteFilters: boolean, shouldForceLoad = false) => {
            const previousFilterOptions = latestFilterOptionsRef.current;
            const actualDisabledFilterState = getDisabledFilterState(
                actualFilters,
                previousFilterOptions,
            );
            const request = removeEmptyFiltersFromRequest(
                removeInactiveRatingFieldsFromRequest(
                    removeDisabledFiltersFromRequest(
                        createFilterOptionsRequest(actualFilters, shouldApplyTasteFilters),
                        actualFilters,
                        actualDisabledFilterState,
                    ),
                    actualFilters,
                    previousFilterOptions,
                    isLoverRating,
                ),
            );
            const requestKey = JSON.stringify(request);

            if (!shouldForceLoad && lastFilterOptionsRequestKeyRef.current === requestKey) {
                return null;
            }

            lastFilterOptionsRequestKeyRef.current = requestKey;
            const nextFilterOptions = await loadFilterOptions(request);

            if (nextFilterOptions) {
                latestFilterOptionsRef.current = nextFilterOptions;
                setTypeOptionsCache(prevState => {
                    const nextState = { ...prevState };
                    cacheNumberOptions(nextState, nextFilterOptions.types);
                    return nextState;
                });
                setColorOptionsCache(prevState => {
                    const nextState = { ...prevState };
                    cacheNumberOptions(nextState, nextFilterOptions.colors);
                    return nextState;
                });
                setCountryOptionsCache(prevState => {
                    const nextState = { ...prevState };
                    cacheNumberOptions(nextState, nextFilterOptions.countries);
                    return nextState;
                });
                setRegionOptionsCache(prevState => {
                    const nextState = { ...prevState };
                    cacheNumberOptions(nextState, nextFilterOptions.regions);
                    return nextState;
                });
                setAromaOptionsCache(prevState => {
                    const nextState = { ...prevState };
                    cacheNumberOptions(nextState, nextFilterOptions.aromas);
                    return nextState;
                });
                setFlavorOptionsCache(prevState => {
                    const nextState = { ...prevState };
                    cacheNumberOptions(nextState, nextFilterOptions.flavors);
                    return nextState;
                });
                setFilters(prevState => {
                    const nextState = { ...prevState };
                    const responseMinExpertRating = nextFilterOptions.ratings?.minExpertRating ?? 0;
                    const responseMaxExpertRating = nextFilterOptions.ratings?.maxExpertRating ?? 0;
                    const responseAgeRange = getRoundedAgeRange(nextFilterOptions.ageRange);
                    const isResponseAgeAvailable = isAgeRangeFilterAvailable(nextFilterOptions.ageRange);
                    const isResponseExpertRatingAvailable = isExpertRatingFilterAvailable({
                        minExpertRating: responseMinExpertRating,
                        maxExpertRating: responseMaxExpertRating,
                    });
                    const wasExpertRatingSelected = isExpertRatingSelected(nextState, previousFilterOptions);
                    let shouldUpdateFilters = false;

                    if (!isResponseExpertRatingAvailable && isExpertRatingFilterAvailable(nextState)) {
                        nextState.minExpertRating = 0;
                        nextState.maxExpertRating = 0;
                        shouldUpdateFilters = true;
                    } else if (isResponseExpertRatingAvailable && wasExpertRatingSelected) {
                        const nextMinExpertRating = Math.min(
                            Math.max(nextState.minExpertRating, responseMinExpertRating),
                            responseMaxExpertRating,
                        );
                        const nextMaxExpertRating = Math.min(
                            Math.max(nextState.maxExpertRating, nextMinExpertRating),
                            responseMaxExpertRating,
                        );

                        if (
                            nextState.minExpertRating !== nextMinExpertRating ||
                            nextState.maxExpertRating !== nextMaxExpertRating
                        ) {
                            nextState.minExpertRating = nextMinExpertRating;
                            nextState.maxExpertRating = nextMaxExpertRating;
                            shouldUpdateFilters = true;
                        }
                    } else if (
                        !wasExpertRatingSelected &&
                        (
                            nextState.minExpertRating !== EMPTY_WINE_CHOOSER_FILTERS.minExpertRating ||
                            nextState.maxExpertRating !== EMPTY_WINE_CHOOSER_FILTERS.maxExpertRating
                        )
                    ) {
                        nextState.minExpertRating = EMPTY_WINE_CHOOSER_FILTERS.minExpertRating;
                        nextState.maxExpertRating = EMPTY_WINE_CHOOSER_FILTERS.maxExpertRating;
                        shouldUpdateFilters = true;
                    }

                    if (!isResponseAgeAvailable && (nextState.ageMin !== null || nextState.ageMax !== null)) {
                        nextState.ageMin = null;
                        nextState.ageMax = null;
                        shouldUpdateFilters = true;
                    } else if (isResponseAgeAvailable && nextState.ageMin !== null && nextState.ageMax !== null) {
                        const nextAgeMin = Math.min(
                            Math.max(Math.round(nextState.ageMin), responseAgeRange.minAge),
                            responseAgeRange.maxAge,
                        );
                        const nextAgeMax = Math.min(
                            Math.max(Math.round(nextState.ageMax), nextAgeMin),
                            responseAgeRange.maxAge,
                        );

                        if (nextState.ageMin !== nextAgeMin || nextState.ageMax !== nextAgeMax) {
                            nextState.ageMin = nextAgeMin;
                            nextState.ageMax = nextAgeMax;
                            shouldUpdateFilters = true;
                        }
                    }

                    if (
                        nextState.gender &&
                        !isGenderOptionAvailable(nextFilterOptions.genderOptions || [], nextState.gender)
                    ) {
                        nextState.gender = null;
                        shouldUpdateFilters = true;
                    }

                    const nextTypeIds = filterExistingNumberIds(nextState.typeIds, nextFilterOptions.types);
                    const nextColorIds = filterExistingNumberIds(nextState.colorIds, nextFilterOptions.colors);
                    const nextCountryIds = filterExistingNumberIds(nextState.countryIds, nextFilterOptions.countries);
                    const nextRegionIds = filterExistingNumberIds(nextState.regionIds, nextFilterOptions.regions);
                    const nextAromaIds = filterExistingNumberIds(nextState.aromaIds, nextFilterOptions.aromas);
                    const nextFlavorIds = filterExistingNumberIds(nextState.flavorIds, nextFilterOptions.flavors);
                    const nextGrapeVarieties = filterExistingGrapeVarieties(
                        nextState.grapeVarieties,
                        nextFilterOptions.grapeVarieties,
                    );
                    const nextVintages = filterExistingVintages(
                        nextState.vintages,
                        mapFilterOptionVintages(nextFilterOptions.vintages),
                    );

                    if (!areNumberArraysEqual(nextState.typeIds, nextTypeIds)) {
                        nextState.typeIds = nextTypeIds;
                        shouldUpdateFilters = true;
                    }

                    if (!areNumberArraysEqual(nextState.colorIds, nextColorIds)) {
                        nextState.colorIds = nextColorIds;
                        shouldUpdateFilters = true;
                    }

                    if (!areNumberArraysEqual(nextState.countryIds, nextCountryIds)) {
                        nextState.countryIds = nextCountryIds;
                        shouldUpdateFilters = true;
                    }

                    if (!areNumberArraysEqual(nextState.regionIds, nextRegionIds)) {
                        nextState.regionIds = nextRegionIds;
                        shouldUpdateFilters = true;
                    }

                    if (!areNumberArraysEqual(nextState.aromaIds, nextAromaIds)) {
                        nextState.aromaIds = nextAromaIds;
                        shouldUpdateFilters = true;
                    }

                    if (!areNumberArraysEqual(nextState.flavorIds, nextFlavorIds)) {
                        nextState.flavorIds = nextFlavorIds;
                        shouldUpdateFilters = true;
                    }

                    if (nextState.grapeVarieties.join(',') !== nextGrapeVarieties.join(',')) {
                        nextState.grapeVarieties = nextGrapeVarieties;
                        shouldUpdateFilters = true;
                    }

                    if (nextState.vintages.join(',') !== nextVintages.join(',')) {
                        nextState.vintages = nextVintages;
                        shouldUpdateFilters = true;
                    }

                    if (!shouldApplyTasteFilters || nextState.tasteFilters.length === 0) {
                        if (shouldUpdateFilters) {
                            shouldSkipNextFilterOptionsSyncRef.current = true;
                            saveModeFilters(mode, nextState);
                            return nextState;
                        }

                        return prevState;
                    }

                    const availableTasteCharacteristicIds = nextFilterOptions.tasteCharacteristics.map(item => item.id);
                    const nextTasteFilters = nextState.tasteFilters.filter(item => {
                        return availableTasteCharacteristicIds.includes(item.characteristicId);
                    });

                    if (nextTasteFilters.length !== nextState.tasteFilters.length) {
                        nextState.tasteFilters = nextTasteFilters;
                        shouldUpdateFilters = true;
                    }

                    if (!shouldUpdateFilters) {
                        return prevState;
                    }

                    shouldSkipNextFilterOptionsSyncRef.current = true;
                    saveModeFilters(mode, nextState);
                    return nextState;
                });

                if (shouldApplyTasteFilters && nextFilterOptions.tasteCharacteristics.length === 0) {
                    shouldSkipNextFilterOptionsSyncRef.current = true;
                    setApplyTasteCharacteristics(false);
                }
            }

            return nextFilterOptions;
        },
        [isLoverRating, loadFilterOptions, mode],
    );

    const { debouncedWrapper: debouncedLoadUserRatingFilterOptions, cancelDebounce: cancelUserRatingDebounce } =
        useDebounce((actualFilters: IWineChooserFilters, shouldApplyTasteFilters: boolean) => {
            isUserRatingInteractingRef.current = false;
            loadActualFilterOptions(actualFilters, shouldApplyTasteFilters);
        }, 500);

    const types = filterOptions.types;
    const colors = filterOptions.colors;
    const countries = filterOptions.countries;
    const regions = filterOptions.regions;
    const aromas = filterOptions.aromas;
    const flavors = filterOptions.flavors;
    const tasteCharacteristics = filterOptions.tasteCharacteristics;

    const grapeVarieties = useMemo<IWineChooserGrapeVariety[]>(() => {
        return filterOptions.grapeVarieties.map(item => {
            return {
                name: item.name,
                wineCount: item.wineCount || 0,
            };
        });
    }, [filterOptions.grapeVarieties]);

    const vintages = useMemo(() => {
        return mapFilterOptionVintages(filterOptions.vintages);
    }, [filterOptions.vintages]);

    const grapeVarietiesWithSelected = useMemo(() => {
        const grapeVarietyNames = new Set(grapeVarieties.map(getGrapeVarietyName));
        const nextGrapeVarieties = [...grapeVarieties];

        filters.grapeVarieties.forEach(item => {
            if (!grapeVarietyNames.has(item)) {
                nextGrapeVarieties.push({ name: item, wineCount: 0 });
            }
        });

        return nextGrapeVarieties;
    }, [filters.grapeVarieties, grapeVarieties]);

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
                          minSortNumber: Math.max(TASTE_FILTER_MIN, item.avgSortNumber - 1),
                          maxSortNumber: Math.min(TASTE_FILTER_MAX, item.avgSortNumber + 1),
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
                isSyncingModeDataRef.current = true;
                setIsInitialLoading(true);
                const savedFilters = getModeFilters(mode);
                let nextFilters = cloneEmptyFilters();
                let isPrefillApplied = false;

                if (!isFiltersPristine(savedFilters)) {
                    nextFilters = cloneFilters(savedFilters);
                } else if (mode === 'myself') {
                    await loadActualFilterOptions(cloneEmptyFilters(), false);
                    const prefillFilters = await loadPrefill();

                    if (prefillFilters) {
                        nextFilters = prefillFilters;
                        isPrefillApplied = true;
                        saveModeFilters('myself', prefillFilters);
                    }
                }

                if (!isPrefillApplied && !isFiltersPristine(nextFilters)) {
                    await loadActualFilterOptions(cloneEmptyFilters(), false);
                }

                if (!isActive) {
                    return;
                }

                setApplyTasteCharacteristics(nextFilters.tasteFilters.length > 0);
                setFilters(nextFilters);

                await loadActualFilterOptions(
                    nextFilters,
                    nextFilters.tasteFilters.length > 0 && !isTasteCharacteristicsLocked,
                    isPrefillApplied,
                );

                shouldSkipNextFilterOptionsSyncRef.current = true;
            } finally {
                if (isActive) {
                    setIsInitialLoading(false);
                }
                isSyncingModeDataRef.current = false;
            }
        };

        syncModeData();

        return () => {
            isActive = false;
        };
    }, [isTasteCharacteristicsLocked, loadActualFilterOptions, loadPrefill, mode]);

    useEffect(() => {
        return () => {
            saveModeFilters('myself', cloneEmptyFilters());
            saveModeFilters('friend', cloneEmptyFilters());
        };
    }, []);

    useEffect(() => {
        if (isInitialLoading || isSyncingModeDataRef.current) {
            return;
        }

        if (shouldSkipNextFilterOptionsSyncRef.current) {
            shouldSkipNextFilterOptionsSyncRef.current = false;
            return;
        }

        if (isUserRatingInteractingRef.current) {
            return;
        }

        loadActualFilterOptions(filters, applyTasteCharacteristics && !isTasteCharacteristicsLocked);
    }, [applyTasteCharacteristics, filters, isInitialLoading, isTasteCharacteristicsLocked, loadActualFilterOptions]);

    const typesWithSelected = useMemo(() => {
        return getOptionsWithSelected(types, filters.typeIds, typeOptionsCache);
    }, [filters.typeIds, typeOptionsCache, types]);

    const colorsWithSelected = useMemo(() => {
        return getOptionsWithSelected(colors, filters.colorIds, colorOptionsCache);
    }, [colorOptionsCache, colors, filters.colorIds]);

    const countriesWithSelected = useMemo(() => {
        return getOptionsWithSelected(countries, filters.countryIds, countryOptionsCache);
    }, [countries, countryOptionsCache, filters.countryIds]);

    const regionsWithSelected = useMemo(() => {
        return getOptionsWithSelected(regions, filters.regionIds, regionOptionsCache);
    }, [filters.regionIds, regionOptionsCache, regions]);

    const aromasWithSelected = useMemo(() => {
        return getOptionsWithSelected(aromas, filters.aromaIds, aromaOptionsCache);
    }, [aromaOptionsCache, aromas, filters.aromaIds]);

    const flavorsWithSelected = useMemo(() => {
        return getOptionsWithSelected(flavors, filters.flavorIds, flavorOptionsCache);
    }, [filters.flavorIds, flavorOptionsCache, flavors]);

    const selectedTypes = useMemo(() => {
        return typesWithSelected.filter(item => filters.typeIds.includes(item.id));
    }, [filters.typeIds, typesWithSelected]);

    const selectedColors = useMemo(() => {
        return colorsWithSelected.filter(item => filters.colorIds.includes(item.id));
    }, [colorsWithSelected, filters.colorIds]);

    const selectedCountries = useMemo(() => {
        return countriesWithSelected.filter(item => filters.countryIds.includes(item.id));
    }, [countriesWithSelected, filters.countryIds]);

    const selectedRegions = useMemo(() => {
        return regionsWithSelected.filter(item => filters.regionIds.includes(item.id));
    }, [filters.regionIds, regionsWithSelected]);

    const selectedAromas = useMemo(() => {
        return aromasWithSelected.filter(item => filters.aromaIds.includes(item.id));
    }, [aromasWithSelected, filters.aromaIds]);

    const selectedFlavors = useMemo(() => {
        return flavorsWithSelected.filter(item => filters.flavorIds.includes(item.id));
    }, [filters.flavorIds, flavorsWithSelected]);

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

    const mapNumberOptions = useCallback(
        (items: IWineChooserOption[], selectedIds: number[]): IUniversalPickerOption[] => {
            return items.map(item => {
                return {
                    id: `${item.id}`,
                    title: item.name,
                    subtitle: createCountSubtitle(item.wineCount),
                    isSelected: selectedIds.includes(item.id),
                    onPress: createPickerOptionToggle(`${item.id}`),
                };
            });
        },
        [createPickerOptionToggle],
    );

    const typeOptions = useMemo<IUniversalPickerOption[]>(() => {
        return typesWithSelected.map(item => {
            return {
                id: `${item.id}`,
                title: item.name,
                isSelected: filters.typeIds.includes(item.id),
                onPress: createPickerOptionToggle(`${item.id}`),
            };
        });
    }, [createPickerOptionToggle, filters.typeIds, typesWithSelected]);

    const colorOptions = useMemo<IUniversalPickerOption[]>(() => {
        return colorsWithSelected.map(item => {
            return {
                id: `${item.id}`,
                title: item.name,
                isSelected: filters.colorIds.includes(item.id),
                onPress: createPickerOptionToggle(`${item.id}`),
            };
        });
    }, [colorsWithSelected, createPickerOptionToggle, filters.colorIds]);

    const countryOptions = useMemo(() => {
        return mapNumberOptions(countriesWithSelected, filters.countryIds);
    }, [countriesWithSelected, filters.countryIds, mapNumberOptions]);

    const regionOptions = useMemo(() => {
        return mapNumberOptions(regionsWithSelected, filters.regionIds);
    }, [filters.regionIds, mapNumberOptions, regionsWithSelected]);

    const aromaOptions = useMemo(() => {
        return mapNumberOptions(aromasWithSelected, filters.aromaIds);
    }, [aromasWithSelected, filters.aromaIds, mapNumberOptions]);

    const flavorOptions = useMemo(() => {
        return mapNumberOptions(flavorsWithSelected, filters.flavorIds);
    }, [filters.flavorIds, flavorsWithSelected, mapNumberOptions]);

    const grapeOptions = useMemo<IUniversalPickerOption[]>(() => {
        return grapeVarietiesWithSelected
            .map(item => {
                const name = getGrapeVarietyName(item);

                return {
                    id: name,
                    title: name,
                    subtitle: createCountSubtitle(item.wineCount),
                    isSelected: filters.grapeVarieties.includes(name),
                    onPress: createPickerOptionToggle(name),
                };
            })
            .filter(item => item.title);
    }, [createPickerOptionToggle, filters.grapeVarieties, grapeVarietiesWithSelected]);

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

    const getPickerState = useCallback(
        (key: WineChooserPickerKey): IWineChooserPickerState => {
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
                return {
                    key,
                    title: localization.t('chooseWine.country'),
                    options: countryOptions,
                    isLoading: loadingPickerKey === key,
                    selectionMode: 'multiple',
                };
            }

            if (key === 'region') {
                return {
                    key,
                    title: localization.t('chooseWine.region'),
                    options: regionOptions,
                    isLoading: loadingPickerKey === key,
                    selectionMode: 'multiple',
                };
            }

            if (key === 'vintage') {
                return {
                    key,
                    title: localization.t('chooseWine.vintage'),
                    options: vintageOptions,
                    isLoading: loadingPickerKey === key,
                    selectionMode: 'multiple',
                };
            }

            if (key === 'grape') {
                return {
                    key,
                    title: localization.t('chooseWine.grapeVariety'),
                    options: grapeOptions,
                    isLoading: loadingPickerKey === key,
                    selectionMode: 'multiple',
                };
            }

            if (key === 'aroma') {
                return {
                    key,
                    title: localization.t('chooseWine.aroma'),
                    options: aromaOptions,
                    isLoading: loadingPickerKey === key,
                    selectionMode: 'multiple',
                };
            }

            return {
                key,
                title: localization.t('chooseWine.taste'),
                options: flavorOptions,
                isLoading: loadingPickerKey === key,
                selectionMode: 'multiple',
            };
        },
        [
            aromaOptions,
            colorOptions,
            countryOptions,
            flavorOptions,
            grapeOptions,
            loadingPickerKey,
            regionOptions,
            typeOptions,
            vintageOptions,
        ],
    );

    const openPicker = useCallback(
        async (key: WineChooserPickerKey) => {
            if (key === 'type' && typesWithSelected.length === 0) {
                return;
            }

            if (key === 'color' && colorsWithSelected.length === 0) {
                return;
            }

            if (key === 'region' && regionsWithSelected.length === 0) {
                return;
            }

            if (key === 'grape' && grapeVarietiesWithSelected.length === 0) {
                return;
            }

            if (key === 'vintage' && vintages.length === 0) {
                return;
            }

            if (key === 'aroma' && aromasWithSelected.length === 0) {
                return;
            }

            if (key === 'flavor' && flavorsWithSelected.length === 0) {
                return;
            }

            const nextState = getPickerState(key);
            setPickerState(nextState);
        },
        [
            aromasWithSelected.length,
            colorsWithSelected.length,
            flavorsWithSelected.length,
            getPickerState,
            grapeVarietiesWithSelected.length,
            regionsWithSelected.length,
            typesWithSelected.length,
            vintages.length,
        ],
    );

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

    const createOnQuickCountryPress = useCallback(
        (countryId: number) => {
            return () => {
                const isSelected = filters.countryIds.includes(countryId);
                const countryIds = isSelected
                    ? filters.countryIds.filter(item => item !== countryId)
                    : [...filters.countryIds, countryId];
                const payload: Partial<IWineChooserFilters> = { countryIds };

                if (!areNumberArraysEqual(filters.countryIds, countryIds)) {
                    payload.regionIds = [];
                }

                patchFilters(payload);
            };
        },
        [filters.countryIds, patchFilters],
    );

    const createOnQuickRegionPress = useCallback(
        (regionId: number) => {
            return () => {
                const regionIds = filters.regionIds.includes(regionId)
                    ? filters.regionIds.filter(item => item !== regionId)
                    : [...filters.regionIds, regionId];

                patchFilters({ regionIds });
            };
        },
        [filters.regionIds, patchFilters],
    );

    const createOnQuickGrapePress = useCallback(
        (grapeName: string) => {
            return () => {
                const nextGrapeVarieties = filters.grapeVarieties.includes(grapeName)
                    ? filters.grapeVarieties.filter(item => item !== grapeName)
                    : [...filters.grapeVarieties, grapeName];

                patchFilters({ grapeVarieties: nextGrapeVarieties });
            };
        },
        [filters.grapeVarieties, patchFilters],
    );

    const createOnQuickVintagePress = useCallback(
        (vintage: number | null) => {
            return () => {
                const nextVintages = filters.vintages.includes(vintage)
                    ? filters.vintages.filter(item => item !== vintage)
                    : [...filters.vintages, vintage];

                patchFilters({ vintages: nextVintages });
            };
        },
        [filters.vintages, patchFilters],
    );

    const onOpenQuickCountryPicker = useCallback(() => {
        setPickerState(getPickerState('country'));
    }, [getPickerState]);

    const onOpenQuickRegionPicker = useCallback(() => {
        if (regionsWithSelected.length === 0) {
            return;
        }

        setPickerState(getPickerState('region'));
    }, [getPickerState, regionsWithSelected.length]);

    const onOpenQuickGrapePicker = useCallback(() => {
        if (grapeVarietiesWithSelected.length === 0) {
            return;
        }

        setPickerState(getPickerState('grape'));
    }, [getPickerState, grapeVarietiesWithSelected.length]);

    const onOpenQuickVintagePicker = useCallback(() => {
        if (vintages.length === 0) {
            return;
        }

        setPickerState(getPickerState('vintage'));
    }, [getPickerState, vintages.length]);

    const quickCountryItems = useMemo<IQuickFilterButtonItem[]>(() => {
        const items = countriesWithSelected.slice(0, QUICK_FILTER_LIMIT).map<IQuickFilterButtonItem>(item => {
            return {
                id: `country-${item.id}`,
                title: item.name,
                wineCountText: `${item.wineCount || 0}`,
                isSelected: filters.countryIds.includes(item.id),
                onPress: createOnQuickCountryPress(item.id),
            };
        });

        if (countriesWithSelected.length > QUICK_FILTER_LIMIT) {
            items.push({
                id: 'country-more',
                title: `${localization.t('common.more')}...`,
                isSelected: false,
                isMore: true,
                onPress: onOpenQuickCountryPicker,
            });
        }

        return items;
    }, [countriesWithSelected, createOnQuickCountryPress, filters.countryIds, onOpenQuickCountryPicker]);

    const quickRegionItems = useMemo<IQuickFilterButtonItem[]>(() => {
        const items = regionsWithSelected.slice(0, QUICK_FILTER_LIMIT).map<IQuickFilterButtonItem>(item => {
            return {
                id: `region-${item.id}`,
                title: item.name,
                wineCountText: `${item.wineCount || 0}`,
                isSelected: filters.regionIds.includes(item.id),
                onPress: createOnQuickRegionPress(item.id),
            };
        });

        if (regionsWithSelected.length > QUICK_FILTER_LIMIT) {
            items.push({
                id: 'region-more',
                title: `${localization.t('common.more')}...`,
                isSelected: false,
                isMore: true,
                onPress: onOpenQuickRegionPicker,
            });
        }

        return items;
    }, [createOnQuickRegionPress, filters.regionIds, onOpenQuickRegionPicker, regionsWithSelected]);

    const quickGrapeItems = useMemo<IQuickFilterButtonItem[]>(() => {
        const items = grapeVarietiesWithSelected
            .slice(0, QUICK_FILTER_LIMIT)
            .map<IQuickFilterButtonItem>(item => {
                const name = getGrapeVarietyName(item);

                return {
                    id: `grape-${name}`,
                    title: name,
                    wineCountText: `${item.wineCount || 0}`,
                    isSelected: filters.grapeVarieties.includes(name),
                    onPress: createOnQuickGrapePress(name),
                };
            })
            .filter(item => item.title);

        if (grapeVarietiesWithSelected.length > QUICK_FILTER_LIMIT) {
            items.push({
                id: 'grape-more',
                title: `${localization.t('common.more')}...`,
                isSelected: false,
                isMore: true,
                onPress: onOpenQuickGrapePicker,
            });
        }

        return items;
    }, [createOnQuickGrapePress, filters.grapeVarieties, grapeVarietiesWithSelected, onOpenQuickGrapePicker]);

    const quickVintageItems = useMemo<IQuickFilterButtonItem[]>(() => {
        const items = vintages.slice(0, QUICK_FILTER_LIMIT).map<IQuickFilterButtonItem>(item => {
            const vintage = item.vintage;
            const id = vintage === null ? 'null' : `${vintage}`;

            return {
                id: `vintage-${id}`,
                title: getVintageTitle(vintage),
                wineCountText: `${item.wineCount || 0}`,
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
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
            }

            patchFilters(payload);
            setPickerState(null);
            return;
        }

        if (pickerState.key === 'country') {
            const countryIds = getSelectedNumberOptionIds(pickerState.options);
            const payload: Partial<IWineChooserFilters> = { countryIds };

            if (!areNumberArraysEqual(filters.countryIds, countryIds)) {
                payload.regionIds = [];
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
            const selectedVintages = getSelectedOptionIds(pickerState.options)
                .map(item => {
                    if (item === 'null') {
                        return null;
                    }

                    return Number(item);
                })
                .filter((item): item is number | null => item === null || Number.isFinite(item));

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
    }, [filters.colorIds, filters.countryIds, filters.typeIds, patchFilters, pickerState]);

    const onSelectFemale = useCallback(() => {
        if (isFemaleGenderDisabled) {
            return;
        }

        const nextGender: WineChooserGender = filters.gender === 'female' ? null : 'female';
        patchFilters({ gender: nextGender });
    }, [filters.gender, isFemaleGenderDisabled, patchFilters]);

    const onSelectMale = useCallback(() => {
        if (isMaleGenderDisabled) {
            return;
        }

        const nextGender: WineChooserGender = filters.gender === 'male' ? null : 'male';
        patchFilters({ gender: nextGender });
    }, [filters.gender, isMaleGenderDisabled, patchFilters]);

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

    const onAgeRangeChange = useCallback(
        (ageMin: number, ageMax: number) => {
            if (ageMin === ageRange.minAge && ageMax === ageRange.maxAge) {
                patchFilters({ ageMin: null, ageMax: null });
                return;
            }

            patchFilters({ ageMin, ageMax });
        },
        [ageRange.maxAge, ageRange.minAge, patchFilters],
    );

    const onExpertRatingRangeChange = useCallback(
        (minExpertRating: number, maxExpertRating: number) => {
            if (
                minExpertRating === expertRatingRange.minExpertRating &&
                maxExpertRating === expertRatingRange.maxExpertRating
            ) {
                patchFilters({
                    minExpertRating: EMPTY_WINE_CHOOSER_FILTERS.minExpertRating,
                    maxExpertRating: EMPTY_WINE_CHOOSER_FILTERS.maxExpertRating,
                });
                return;
            }

            patchFilters({ minExpertRating, maxExpertRating });
        },
        [expertRatingRange.maxExpertRating, expertRatingRange.minExpertRating, patchFilters],
    );

    const onUserRatingChange = useCallback(
        (minUserRating: number) => {
            const nextFilters = {
                ...filters,
                minUserRating,
            };

            isUserRatingInteractingRef.current = true;
            shouldSkipNextFilterOptionsSyncRef.current = true;
            cancelUserRatingDebounce();
            saveModeFilters(mode, nextFilters);
            setFilters(nextFilters);
        },
        [
            cancelUserRatingDebounce,
            filters,
            mode,
        ],
    );

    const onUserRatingEnd = useCallback(
        (minUserRating: number) => {
            const nextFilters = {
                ...filters,
                minUserRating,
            };

            isUserRatingInteractingRef.current = true;
            shouldSkipNextFilterOptionsSyncRef.current = true;
            saveModeFilters(mode, nextFilters);
            setFilters(nextFilters);
            debouncedLoadUserRatingFilterOptions(
                nextFilters,
                applyTasteCharacteristics && !isTasteCharacteristicsLocked,
            );
        },
        [
            applyTasteCharacteristics,
            debouncedLoadUserRatingFilterOptions,
            filters,
            isTasteCharacteristicsLocked,
            mode,
        ],
    );

    const onToggleTasteCharacteristics = useCallback(() => {
        const nextApplyTasteCharacteristics = !applyTasteCharacteristics;
        const shouldApplyTasteFilters = nextApplyTasteCharacteristics && !isTasteCharacteristicsLocked;
        const nextTasteFilters = shouldApplyTasteFilters
            ? createTasteFiltersFromCharacteristics(tasteCharacteristics)
            : [];
        const nextFilters = {
            ...filters,
            tasteFilters: nextTasteFilters,
        };

        shouldSkipNextFilterOptionsSyncRef.current = true;
        saveModeFilters(mode, nextFilters);
        setFilters(nextFilters);
        setApplyTasteCharacteristics(nextApplyTasteCharacteristics);
        loadActualFilterOptions(nextFilters, shouldApplyTasteFilters && nextTasteFilters.length > 0, true);
    }, [
        applyTasteCharacteristics,
        filters,
        isTasteCharacteristicsLocked,
        loadActualFilterOptions,
        mode,
        tasteCharacteristics,
    ]);

    const onTasteRangeChange = useCallback(
        (characteristicId: number, minSortNumber: number, maxSortNumber: number) => {
            const nextTasteFilters = filters.tasteFilters.filter(item => item.characteristicId !== characteristicId);
            nextTasteFilters.push({ characteristicId, minSortNumber, maxSortNumber });
            patchFilters({ tasteFilters: nextTasteFilters });
        },
        [filters.tasteFilters, patchFilters],
    );

    const createOnTasteRangeChange = useCallback(
        (characteristicId: number) => {
            return (minSortNumber: number, maxSortNumber: number) => {
                onTasteRangeChange(characteristicId, minSortNumber, maxSortNumber);
            };
        },
        [onTasteRangeChange],
    );

    const tasteItems = useMemo(() => {
        return tasteCharacteristics.map(item => {
            const currentFilter = filters.tasteFilters.find(filterItem => filterItem.characteristicId === item.id);
            const minSortNumber = Math.min(
                Math.max(currentFilter?.minSortNumber || item.minSortNumber, TASTE_FILTER_MIN),
                TASTE_FILTER_MAX,
            );
            const maxSortNumber = Math.min(
                Math.max(currentFilter?.maxSortNumber || item.maxSortNumber, minSortNumber),
                TASTE_FILTER_MAX,
            );
            const colorHex = item.colorHex || '#8D5A4C';

            return {
                id: item.id,
                title: item.name,
                description: item.description || '',
                colorHex,
                inactiveColor: createInactiveTrackColor(colorHex),
                minSortNumber,
                maxSortNumber,
                minValue: TASTE_FILTER_MIN,
                maxValue: TASTE_FILTER_MAX,
                labels: [],
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

    const onResetPress = useCallback(() => {
        const nextFilters = cloneEmptyFilters();

        shouldSkipNextFilterOptionsSyncRef.current = true;
        isUserRatingInteractingRef.current = false;
        cancelUserRatingDebounce();
        setPickerState(null);
        setApplyTasteCharacteristics(false);
        saveModeFilters(mode, nextFilters);
        setFilters(nextFilters);
        loadActualFilterOptions(nextFilters, false, true);
    }, [cancelUserRatingDebounce, loadActualFilterOptions, mode]);

    const userRatingHintText = useMemo(() => {
        if (!filters.minUserRating) {
            return localization.t('chooseWine.ratingScaleHint');
        }

        return `${filters.minUserRating.toFixed(1)} ${getRatingDescription(filters.minUserRating)}`;
    }, [filters.minUserRating]);
    const isCurrentExpertRatingSelected = isExpertRatingSelected(filters, filterOptions);
    const applyWineCountText = typeof filterOptions.totalWineCount === 'number'
        ? `(${createWineCountText(filterOptions.totalWineCount)})`
        : '';

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
        isTypeDisabled: typesWithSelected.length === 0,
        isColorDisabled: colorsWithSelected.length === 0,
        isRegionDisabled: loadingPickerKey === 'region' || regionsWithSelected.length === 0,
        isAromaDisabled: aromasWithSelected.length === 0,
        isFlavorDisabled: flavorsWithSelected.length === 0,
        isAgeDisabled,
        isFemaleGenderDisabled,
        isMaleGenderDisabled,
        femaleGenderTitle: localization.t('chooseWine.women'),
        femaleGenderWineCountText: createWineCountBadgeText(femaleGenderOption?.wineCount),
        maleGenderTitle: localization.t('chooseWine.men'),
        maleGenderWineCountText: createWineCountBadgeText(maleGenderOption?.wineCount),
        ageMin: isAgeDisabled ? AGE_MIN : filters.ageMin || ageRange.minAge,
        ageMax: isAgeDisabled ? AGE_MAX : filters.ageMax || ageRange.maxAge,
        allowedAgeMin: isAgeDisabled ? AGE_MIN : ageRange.minAge,
        allowedAgeMax: isAgeDisabled ? AGE_MAX : ageRange.maxAge,
        ratingMin: isExpertRatingDisabled || !isCurrentExpertRatingSelected
            ? expertRatingRange.minExpertRating
            : filters.minExpertRating,
        ratingMax: isExpertRatingDisabled || !isCurrentExpertRatingSelected
            ? expertRatingRange.maxExpertRating
            : filters.maxExpertRating,
        allowedRatingMin: isExpertRatingDisabled ? RATING_MIN : expertRatingRange.minExpertRating,
        allowedRatingMax: isExpertRatingDisabled ? RATING_MAX : expertRatingRange.maxExpertRating,
        userRating: filters.minUserRating,
        userRatingHintText,
        isExpertRatingDisabled,
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
        quickRegionItems,
        quickGrapeItems,
        quickVintageItems,
        applyWineCountText,
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
        onUserRatingEnd,
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
        onResetPress,
    };
};
