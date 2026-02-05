import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';
import { GenerateNoteDto } from '@/entities/wine/dto/GenerateNote.dto';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { IRateContext } from '@/entities/wine/types/IRateContext';
import { storage } from '@/libs/storage/MMKVStorage';
import { clearTasteCharacteristicsCache } from '@/libs/storage/cacheUtils';

export const useWineReviewResult = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoadingLimits, setIsLoadingLimits] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [note, setNote] = useState<string | null>(null);
    const [limits, setLimits] = useState<IRateContext | null>(null);
    const isPremiumUser = userModel.user?.hasPremium || false;

    const getLimits = useCallback(async () => {
        try {
            if (!wineModel.wine?.id) return;

            setIsLoadingLimits(true);

            const params = { wineId: wineModel.wine?.id };
            
            const response = await wineService.getLimits(params);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                }
            } else {
                setLimits(response.data);
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoadingLimits(false);
        }
    }, []);

    const getNote = useCallback(async () => {
        try {
            setIsLoading(true);

            if (!wineModel.look) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const payload: GenerateNoteDto = {
                wineId: wineModel.wine?.id || 0,
                review: wineModel.review?.review.trim() || '',
                color: wineModel.look,
                aromas: (wineModel.selectedSmells || [])
                    .filter(item => item.colorHex)
                    .map(item => item.id),
                flavors: (wineModel.selectedTastes || [])
                    .filter(item => item.colorHex)
                    .map(item => item.id),
                tasteCharacteristics: (wineModel.tasteCharacteristics || [])
                    .map(item => {
                        const selectedIndex = item.selectedIndex ?? 0;
                        const level = item.levels[selectedIndex];

                        if (!level) {
                            return null;
                        }

                        return {
                            characteristicId: item.id,
                            levelId: level.id,
                        };
                    })
                    .filter((item): item is GenerateNoteDto['tasteCharacteristics'][number] => Boolean(item)),
            };

            if (userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER) {
                payload.userRating = wineModel.review?.starRate;
            } else {
                payload.expertRating = wineModel.review?.rate;
            }

            if (wineModel.base?.typeOfWine.isSparkling) {
                payload.color = {
                    ...payload.color,
                    mousse: wineModel.look.mousse,
                    perlage: wineModel.look.perlage,
                    appearance: wineModel.look.appearance,
                };
            }

            const response = await wineService.generateNote(payload);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                }
            } else {
                setLimits(prevState => {
                    if (!prevState) {
                        return prevState;
                    }
                    return {
                        ...prevState,
                        aiUsage: {
                            ...prevState.aiUsage,
                            left: Math.max(0, prevState.aiUsage.left - 1),
                        },
                    };
                });
                setNote(response.data.note);
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const load = useCallback(async (isActiveRef: { current: boolean }) => {
        await getLimits();
        if (!isActiveRef.current) {
            return;
        }
        await getNote();
    }, [getLimits, getNote]);

    useEffect(() => {
        const isActiveRef = { current: true };

        load(isActiveRef);

        return () => {
            isActiveRef.current = false;
        };
    }, [load]);

    const handleSavePress = useCallback(async () => {
        try {
            setIsSaving(true);

            const available = isPremiumUser
                ? wineModel.tasteCharacteristics
                : wineModel.tasteCharacteristics?.filter(item => !item.isPremium);

            const aromas = wineModel.selectedSmells
                ?.filter(item => item.aroma?.colorHex)
                ?.map(item => item.aroma?.id || 0);
            const suggestedAromas = wineModel.selectedSmells
                ?.filter(item => !item.aroma?.colorHex)
                ?.map(item => item.name || '');

            const flavors = wineModel.selectedTastes?.filter(item => item.colorHex)?.map(item => item.id);
            const suggestedFlavors = wineModel.selectedTastes
                ?.filter(item => !item.colorHex)
                ?.map(item => item.name || '');

            const payload: AddRateDto = {
                wineId: wineModel.wine?.id || 0,
                review: wineModel.review?.review.trim() || '',
                color: {
                    colorId: wineModel.look?.colorId || 0,
                    shadeId: wineModel.look?.shadeId || 0,
                    tone: wineModel.look?.tone || '',
                },
                aromas: aromas || [],
                flavors: flavors || [],
                tasteCharacteristics:
                    available?.map(item => {
                        const selectedIndex = item.selectedIndex ?? 0;
                        return {
                            characteristicId: item.id,
                            levelId: item.levels[selectedIndex]?.id || 0,
                        };
                    }) || [],
            };

            if (wineModel.image) {
                payload.image = wineModel.image;
            }

            if (userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER) {
                payload.userRating = wineModel.review?.starRate;
            } else {
                payload.expertRating = wineModel.review?.rate;
            }

            if (wineModel.base?.typeOfWine.isSparkling) {
                payload.color = {
                    ...payload.color,
                    mousse: wineModel.look?.mousse || 0,
                    perlage: wineModel.look?.perlage || 0,
                    appearance: wineModel.look?.appearance || 0,
                };
            }

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

            const response = await wineService.addToRate(payload);

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
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
                    navigation.popTo('WineDetailsView', wineDetailsParams);
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
                wineModel.clear();
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsSaving(false);
        }
    }, [navigation, isPremiumUser]);

    return { handleSavePress, note, isLoading, isSaving, limits, isLoadingLimits, getNote, setLimits };
};
