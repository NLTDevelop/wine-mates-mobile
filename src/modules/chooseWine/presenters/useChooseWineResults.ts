import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineService } from '@/entities/wine/services/WineService';
import {
    EMPTY_WINE_CHOOSER_FILTERS,
    wineChooserFriendFiltersModel,
    wineChooserMyselfFiltersModel,
} from '@/entities/wine/models/WineChooserFiltersModel';
import { wineChooserResultsModel } from '@/entities/wine/models/WineChooserResultsModel';
import { IWineChooserFilters, WineChooserMode } from '@/entities/wine/types/IWineChooser';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { userModel } from '@/entities/users/UserModel';

type RouteParams = {
    ChooseWineResultsView: {
        mode: WineChooserMode;
    };
};

type LegacyWineChooserFilters = IWineChooserFilters & {
    vintageMin?: number | null;
    vintageMax?: number | null;
};

const LIST_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 350;

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

const prepareRequestFilters = (filters: IWineChooserFilters): IWineChooserFilters => {
    const restFilters = { ...filters } as LegacyWineChooserFilters;
    delete restFilters.vintageMin;
    delete restFilters.vintageMax;
    const canApplyTasteFilters = userModel.user?.hasPremium || false;

    return {
        ...restFilters,
        ageMin: filters.ageMin || null,
        ageMax: filters.ageMax || null,
        vintages: filters.vintages || [],
        tasteFilters: canApplyTasteFilters ? filters.tasteFilters : [],
    };
};

const getAppliedFiltersCount = (filters: IWineChooserFilters) => {
    let count = 0;
    const canApplyTasteFilters = userModel.user?.hasPremium || false;

    if (filters.aromaIds.length > 0) {
        count += 1;
    }

    if (filters.flavorIds.length > 0) {
        count += 1;
    }

    if (filters.gender) {
        count += 1;
    }

    if (filters.ageMin || filters.ageMax) {
        count += 1;
    }

    if (filters.typeIds.length > 0) {
        count += 1;
    }

    if (filters.colorIds.length > 0) {
        count += 1;
    }

    if (filters.minUserRating > EMPTY_WINE_CHOOSER_FILTERS.minUserRating) {
        count += 1;
    }

    if (
        filters.minExpertRating !== EMPTY_WINE_CHOOSER_FILTERS.minExpertRating ||
        filters.maxExpertRating !== EMPTY_WINE_CHOOSER_FILTERS.maxExpertRating
    ) {
        count += 1;
    }

    if (filters.countryIds.length > 0) {
        count += 1;
    }

    if (filters.regionIds.length > 0) {
        count += 1;
    }

    if (filters.grapeVarieties.length > 0) {
        count += 1;
    }

    if ((filters.vintages || []).length > 0) {
        count += 1;
    }

    if (canApplyTasteFilters && filters.tasteFilters.length > 0) {
        count += 1;
    }

    return count;
};

export const useChooseWineResults = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RouteParams, 'ChooseWineResultsView'>>();
    const mode = route.params?.mode || 'friend';
    const [filters, setFilters] = useState<IWineChooserFilters>(() => getModeFilters(mode) || EMPTY_WINE_CHOOSER_FILTERS);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const requestIdRef = useRef(0);

    const wines = wineChooserResultsModel.list?.rows || [];
    const hasMore = !!wineChooserResultsModel.list && wineChooserResultsModel.list.count > wines.length;
    const appliedFiltersCount = useMemo(() => {
        return getAppliedFiltersCount(filters);
    }, [filters]);

    const loadWines = useCallback(async (offset: number, nextFilters: IWineChooserFilters, append: boolean) => {
        requestIdRef.current += 1;
        const requestId = requestIdRef.current;

        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }

        const response = await wineService.chooseWines({
            ...prepareRequestFilters(nextFilters),
            offset,
            limit: LIST_LIMIT,
        });

        if (requestId !== requestIdRef.current) {
            return;
        }

        if (response.isError || !response.data) {
            toastService.showError(
                localization.t('common.errorHappened'),
                response.message || localization.t('common.somethingWentWrong'),
            );
        }

        if (append) {
            setIsLoadingMore(false);
        } else {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            saveModeFilters(mode, filters);
            loadWines(0, filters, false);
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [filters, loadWines, mode]);

    useEffect(() => {
        return () => {
            wineChooserResultsModel.list = null;
        };
    }, []);

    const onSearchChange = useCallback((searchQuery: string) => {
        setFilters(prevState => {
            const nextState = { ...prevState, searchQuery };
            saveModeFilters(mode, nextState);
            return nextState;
        });
    }, [mode]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadWines(0, filters, false);
    }, [filters, loadWines]);

    const onEndReached = useCallback(() => {
        if (isLoading || isLoadingMore || !hasMore) {
            return;
        }

        loadWines(wines.length, filters, true);
    }, [filters, hasMore, isLoading, isLoadingMore, loadWines, wines.length]);

    const onWinePress = useCallback((item: IWineListItem) => {
        navigation.navigate('WineDetailsView', { wineId: item.id });
    }, [navigation]);

    const onFilterPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const title = useMemo(() => {
        if (mode === 'myself') {
            return localization.t('chooseWine.resultsMyselfTitle');
        }

        return localization.t('chooseWine.resultsFriendTitle');
    }, [mode]);

    return {
        title,
        searchQuery: filters.searchQuery,
        wines,
        isLoading,
        isRefreshing,
        isLoadingMore,
        appliedFiltersCount,
        onSearchChange,
        onRefresh,
        onEndReached,
        onWinePress,
        onFilterPress,
    };
};
