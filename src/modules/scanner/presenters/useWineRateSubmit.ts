import { useCallback } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';
import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { clearTasteCharacteristicsCache, clearWineSnackCuisinesCache } from '@/libs/storage/cacheUtils';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

interface ISaveWineRateParams {
    isFullTasting?: boolean;
}

const addRatingToPayload = (payload: Partial<AddRateDto>) => {
    if (userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER) {
        const starRate = wineModel.review?.starRate ?? 0;
        if (typeof starRate === 'number' && !Number.isNaN(starRate)) {
            payload.userRating = Number(starRate.toFixed(1));
        }

        return;
    }

    if (wineModel.review?.hasChangedRate && wineModel.review?.rate) {
        payload.expertRating = wineModel.review.rate;
    }
};

const buildShortWineRatePayload = (): Partial<AddRateDto> => {
    const payload: Partial<AddRateDto> = {
        wineId: wineModel.wine?.id || 0,
        review: wineModel.review?.review.trim() || '',
    };

    addRatingToPayload(payload);

    if (wineModel.winePeak !== null) {
        payload.winePeak = wineModel.winePeak;
    }

    return payload;
};

const buildFullWineRatePayload = (isPremiumUser: boolean): Partial<AddRateDto> => {
    const payload: Partial<AddRateDto> = {
        wineId: wineModel.wine?.id || 0,
        review: wineModel.review?.review.trim() || '',
    };

    if (wineModel.look) {
        payload.color = {
            colorId: wineModel.look.colorId,
            shadeId: wineModel.look.shadeId,
            tone: wineModel.look.tone,
        };

        if (wineModel.base?.typeOfWine.isSparkling) {
            payload.color = {
                ...payload.color,
                mousse: wineModel.look.mousse || 0,
                perlage: wineModel.look.perlage || 0,
                appearance: wineModel.look.appearance || 0,
            };
        }
    }

    const available = isPremiumUser
        ? wineModel.tasteCharacteristics
        : wineModel.tasteCharacteristics?.filter(item => !item.isPremium);

    const aromas = wineModel.selectedSmells
        ?.filter(item => item.colorHex)
        ?.map(item => item.id);
    const suggestedAromas = wineModel.selectedSmells
        ?.filter(item => !item.colorHex)
        ?.map(item => item.name || '');

    const flavors = wineModel.selectedTastes?.filter(item => item.colorHex)?.map(item => item.id);
    const suggestedFlavors = wineModel.selectedTastes
        ?.filter(item => !item.colorHex)
        ?.map(item => item.name || '');

    if (aromas) {
        payload.aromas = aromas;
    }

    if (flavors) {
        payload.flavors = flavors;
    }

    if (available) {
        payload.tasteCharacteristics = available.map(item => {
            const selectedIndex = item.selectedIndex ?? 0;
            return {
                characteristicId: item.id,
                levelId: item.levels[selectedIndex]?.id || 0,
            };
        });
    }

    if (wineModel.image) {
        payload.image = wineModel.image;
    }

    if (wineModel.winePeak !== null) {
        payload.winePeak = wineModel.winePeak;
    }

    addRatingToPayload(payload);

    const hasSuggestedAromas = (suggestedAromas?.length ?? 0) > 0;
    const hasSuggestedFlavors = (suggestedFlavors?.length ?? 0) > 0;

    if (hasSuggestedAromas || hasSuggestedFlavors) {
        payload.suggestions = {};

        if (hasSuggestedAromas) {
            payload.suggestions.aromas = suggestedAromas;
        }

        if (hasSuggestedFlavors) {
            payload.suggestions.flavors = suggestedFlavors;
        }
    }

    if (wineModel.review?.aiTastingNote) {
        payload.aiTastingNote = wineModel.review.aiTastingNote;
    }

    if (wineModel.review?.aiSnacks) {
        payload.aiSnacks = wineModel.review.aiSnacks;
    }

    return payload;
};

const resetAfterWineRate = (navigation: NativeStackNavigationProp<any>) => {
    const state = navigation.getState();
    const hasDetailsScreen = state.routes.some(route => route.name === 'WineDetailsView');
    const wineDetailsParams = { wineId: wineModel.wine?.id };
    const routesToDrop = new Set([
        'AddWineView',
        'WineLookView',
        'WineSmellView',
        'WineTasteView',
        'WineTasteCharacteristicsView',
        'WineReviewView',
        'WineReviewResultView',
    ]);
    const normalizeScannerStack = (route: any) => {
        if (route.name !== 'TabNavigator' || !route.state) return route;

        const tabState = route.state;
        const tabRoutes = tabState.routes?.map((tabRoute: any) => {
            if (tabRoute.name !== 'ScannerStack' || !tabRoute.state) return tabRoute;

            const scannerState = tabRoute.state;
            const scannerRoutes =
                scannerState.routes?.filter((stackRoute: any) => stackRoute.name !== 'AddWineView') || [];
            const ensuredRoutes = scannerRoutes.length ? scannerRoutes : [{ name: 'ScanResultsListView' }];

            return {
                ...tabRoute,
                state: {
                    ...scannerState,
                    routes: ensuredRoutes,
                    index: Math.max(0, ensuredRoutes.length - 1),
                },
            };
        });

        return {
            ...route,
            state: {
                ...tabState,
                routes: tabRoutes || tabState.routes,
            },
        };
    };

    if (hasDetailsScreen) {
        const detailsRoute = state.routes.find(route => route.name === 'WineDetailsView');
        if (detailsRoute) {
            const updatedRoutes = state.routes.map(route =>
                route.name === 'WineDetailsView'
                    ? { ...route, params: wineDetailsParams }
                    : route
            );
            const detailsIndex = updatedRoutes.findIndex(route => route.name === 'WineDetailsView');
            const filteredRoutes = updatedRoutes.slice(0, detailsIndex + 1);

            navigation.dispatch(
                CommonActions.reset({
                    ...state,
                    routes: filteredRoutes,
                    index: filteredRoutes.length - 1,
                }),
            );
        }
    } else {
        const filteredRoutes = state.routes.filter(route => !routesToDrop.has(route.name));
        const normalizedRoutes = filteredRoutes.map(normalizeScannerStack);
        const safeRoutes = normalizedRoutes.length
            ? normalizedRoutes
            : [normalizeScannerStack(state.routes[0])];
        const routes = [...safeRoutes, { name: 'WineDetailsView', params: wineDetailsParams }];

        navigation.dispatch(
            CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            }),
        );
    }

    clearTasteCharacteristicsCache();
    clearWineSnackCuisinesCache();
    wineModel.clear();
};

export const useWineRateSubmit = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const isPremiumUser = userModel.user?.hasPremium || false;

    const saveWineRate = useCallback(async (params?: ISaveWineRateParams) => {
        const payload = params?.isFullTasting === false
            ? buildShortWineRatePayload()
            : buildFullWineRatePayload(isPremiumUser);
        const response = await wineService.addToRate(payload);

        if (response.isError) {
            toastService.showError(
                localization.t('common.errorHappened'),
                response.message || localization.t('common.somethingWentWrong'),
            );
            return false;
        }

        resetAfterWineRate(navigation);

        return true;
    }, [isPremiumUser, navigation]);

    return {
        saveWineRate,
    };
};
