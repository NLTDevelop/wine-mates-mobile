/* eslint-disable react-hooks/set-state-in-effect */
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { eventTastingService } from '@/entities/events/EventTastingService';
import { userModel } from '@/entities/users/UserModel';
import { wineService } from '@/entities/wine/services/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';
import { GenerateNoteDto } from '@/entities/wine/dto/GenerateNote.dto';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IRateContext } from '@/entities/wine/types/IRateContext';
import {
    clearTasteCharacteristicsCache,
    clearWineSnackCuisinesCache,
    getWineSnackCuisinesCache,
    IWineSnackCuisineCacheItem,
    setWineSnackCuisinesCache,
} from '@/libs/storage/cacheUtils';
import { clearWineModel } from '@/entities/wine/services/WineModelService';
import { useEventTastingDraft } from '@/modules/tastings/presenters/useEventTastingDraft';
import { snackService } from '@/entities/snacks/SnackService';
import { IWineSnackCuisine } from '@/entities/snacks/types/IWineSnackCuisine';
import { IWineSnackCuisineOption } from '@/entities/snacks/types/IWineSnackCuisineOption';
import { useFoodPairing } from '@/UIKit/FoodPairing/presenters/useFoodPairing';
import { wineModel } from '@/entities/wine/models/WineModel';
import { WineSetTastingStatus } from '@/entities/events/types/IWineSetItem';
import { useSaveEventTastingDraftOnBlur } from '@/modules/tastings/presenters/useSaveEventTastingDraftOnBlur';

interface IRouteParams {
    eventId?: number;
    wineId?: number;
    isBlindTasting?: boolean;
    tastingStatus?: WineSetTastingStatus;
}

const DEFAULT_EXPERT_RATING = 70;

export const useTastingWineReviewResult = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const navigationRoute = useRoute();
    const routeParams = (navigationRoute.params as IRouteParams | undefined) || {};
    const eventId = routeParams.eventId;
    const wineId = routeParams.wineId;
    const isEditingFinishedTasting = routeParams.tastingStatus === 'tasted';
    const cuisineCacheWineId = wineModel.wine?.id ?? wineId;
    const { buildEventTastingDraftPayload } = useEventTastingDraft();
    const [isLoadingLimits, setIsLoadingLimits] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isNoteEditing, setIsNoteEditing] = useState(false);
    const [noteValidationError, setNoteValidationError] = useState<string | null>(null);
    const [note, setNote] = useState<string | null>(wineModel.review?.aiTastingNote || null);
    const [limits, setLimits] = useState<IRateContext | null>(null);
    const [isCuisineModalVisible, setIsCuisineModalVisible] = useState(false);
    const [isLoadingCuisines, setIsLoadingCuisines] = useState(false);
    const [cuisines, setCuisines] = useState<IWineSnackCuisine[]>([]);
    const [selectedCuisineItems, setSelectedCuisineItems] = useState<IWineSnackCuisineCacheItem[]>(() => {
        return getWineSnackCuisinesCache(cuisineCacheWineId) || [];
    });
    const isPremiumUser = userModel.user?.hasPremium || false;
    const isSelectedParametersVisible = !routeParams.isBlindTasting;

    const patchReview = useCallback((payload: Partial<NonNullable<typeof wineModel.review>>) => {
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            ...payload,
        };
    }, []);

    const buildGenerateNotePayload = useCallback((): GenerateNoteDto | null => {
        if (!wineModel.look) {
            return null;
        }

        const suggestedAromas = (wineModel.selectedSmells || [])
            .filter(item => !item.colorHex && item.name?.trim())
            .map(item => item.name.trim());
        const suggestedFlavors = (wineModel.selectedTastes || [])
            .filter(item => !item.colorHex && item.name?.trim())
            .map(item => item.name.trim());

        const payload: GenerateNoteDto = {
            wineId: wineModel.wine?.id || wineId || 0,
            review: wineModel.review?.review.trim() || '',
            color: wineModel.look,
            aromas: (wineModel.selectedSmells || []).filter(item => item.colorHex).map(item => item.id),
            flavors: (wineModel.selectedTastes || []).filter(item => item.colorHex).map(item => item.id),
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
            const starRate = wineModel.review?.starRate ?? 0;
            if (typeof starRate === 'number' && !Number.isNaN(starRate)) {
                payload.userRating = Number(starRate.toFixed(1));
            }
        } else {
            const expertRating = wineModel.review?.rate ?? DEFAULT_EXPERT_RATING;
            if (typeof expertRating === 'number' && !Number.isNaN(expertRating)) {
                payload.expertRating = expertRating;
            }
        }

        if (wineModel.base?.typeOfWine.isSparkling) {
            payload.color = {
                ...payload.color,
                mousse: wineModel.look.mousse,
                perlage: wineModel.look.perlage,
                appearance: wineModel.look.appearance,
            };
        }

        const hasSuggestedAromas = suggestedAromas.length > 0;
        const hasSuggestedFlavors = suggestedFlavors.length > 0;

        if (hasSuggestedAromas || hasSuggestedFlavors) {
            payload.suggestions = {};

            if (hasSuggestedAromas) {
                payload.suggestions.aromas = suggestedAromas;
            }

            if (hasSuggestedFlavors) {
                payload.suggestions.flavors = suggestedFlavors;
            }
        }

        return payload;
    }, [wineId]);

    const getLimits = useCallback(async () => {
        try {
            if (!wineModel.wine?.id) return null;

            setIsLoadingLimits(true);

            const params = { wineId: wineModel.wine?.id };

            const response = await wineService.getLimits(params);

            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                }
                return null;
            } else {
                setLimits(response.data);
                return response.data;
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            return null;
        } finally {
            setIsLoadingLimits(false);
        }
    }, []);

    const saveEventTastingDraft = useCallback(async () => {
        if (!eventId || !wineId) {
            return;
        }

        const response = await eventTastingService.saveDraft({
            eventId,
            wineId,
            data: buildEventTastingDraftPayload(wineId),
            isFinal: isEditingFinishedTasting,
        });

        if (response.isError) {
            toastService.showError(
                localization.t('common.errorHappened'),
                response.message || localization.t('common.somethingWentWrong'),
            );
        }
    }, [buildEventTastingDraftPayload, eventId, isEditingFinishedTasting, wineId]);

    const { skipNextBlurSave } = useSaveEventTastingDraftOnBlur({
        eventId,
        wineId,
        buildPayload: buildEventTastingDraftPayload,
        isFinal: isEditingFinishedTasting,
    });

    const selectedCuisineIds = useMemo(() => {
        return selectedCuisineItems.map(item => item.id);
    }, [selectedCuisineItems]);

    const selectedCuisineNames = useMemo(() => {
        if (cuisines.length === 0) {
            return selectedCuisineItems.map(item => item.name);
        }

        return selectedCuisineIds
            .map(id => cuisines.find(item => item.id === id)?.name)
            .filter((name): name is string => Boolean(name));
    }, [cuisines, selectedCuisineIds, selectedCuisineItems]);

    const cuisineSelectButtonText = useMemo(() => {
        if (selectedCuisineNames.length === 0) {
            return localization.t('wine.snackCuisines');
        }

        return selectedCuisineNames.join(', ');
    }, [selectedCuisineNames]);

    const {
        snacks,
        isGenerating: isGeneratingSnacks,
        onGeneratePress: onGenerateSnacksPress,
    } = useFoodPairing(setLimits, wineModel.review?.aiSnacks || undefined, saveEventTastingDraft, selectedCuisineNames);

    const loadCuisines = useCallback(async () => {
        try {
            setIsLoadingCuisines(true);

            const response = await snackService.getWineSnackCuisines();

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            setCuisines(response.data);
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoadingCuisines(false);
        }
    }, []);

    const onOpenCuisinePickerPress = useCallback(() => {
        setIsCuisineModalVisible(true);

        if (cuisines.length === 0) {
            loadCuisines();
        }
    }, [cuisines.length, loadCuisines]);

    const onCloseCuisinePicker = useCallback(() => {
        setIsCuisineModalVisible(false);
    }, []);

    const onToggleCuisine = useCallback((id: number) => {
        setSelectedCuisineItems(prevState => {
            if (prevState.some(item => item.id === id)) {
                const nextState = prevState.filter(item => item.id !== id);
                setWineSnackCuisinesCache(cuisineCacheWineId, nextState);
                return nextState;
            }

            const cuisine = cuisines.find(item => item.id === id);

            if (!cuisine) {
                return prevState;
            }

            const nextState = [...prevState, { id: cuisine.id, name: cuisine.name }];
            setWineSnackCuisinesCache(cuisineCacheWineId, nextState);
            return nextState;
        });
    }, [cuisineCacheWineId, cuisines]);

    const cuisineOptions = useMemo<IWineSnackCuisineOption[]>(() => {
        return cuisines.map(item => {
            return {
                id: item.id,
                name: item.name,
                isSelected: selectedCuisineIds.includes(item.id),
                onPress: () => onToggleCuisine(item.id),
            };
        });
    }, [cuisines, onToggleCuisine, selectedCuisineIds]);

    const onConfirmCuisineSelection = useCallback(() => {
        setIsCuisineModalVisible(false);
    }, []);

    const getNote = useCallback(async () => {
        try {
            setIsLoading(true);
            setIsNoteEditing(false);
            setNoteValidationError(null);

            if (!wineModel.look) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const payload = buildGenerateNotePayload();

            if (!payload) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const response = routeParams.isBlindTasting
                ? await wineService.generateBlindNote(payload)
                : await wineService.generateNote(payload);

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
                const generatedNote = response.data.note || null;
                setNote(generatedNote);
                patchReview({
                    aiTastingNote: generatedNote,
                    initialAiTastingNote: generatedNote,
                    hasEditedAiTastingNote: false,
                });
                await saveEventTastingDraft();
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, [buildGenerateNotePayload, patchReview, routeParams.isBlindTasting, saveEventTastingDraft]);

    const load = useCallback(
        async (isActiveRef: { current: boolean }) => {
            const limitsData = await getLimits();
            if (!isActiveRef.current) {
                return;
            }

            const cachedNote = wineModel.review?.aiTastingNote || null;
            if (cachedNote) {
                setNote(cachedNote);
                setIsLoading(false);
                return;
            }

            if (eventId) {
                setIsLoading(false);
                return;
            }

            if (limitsData?.aiUsage.left === 0) {
                setIsLoading(false);
                return;
            }

            await getNote();
        },
        [eventId, getLimits, getNote],
    );

    useEffect(() => {
        const isActiveRef = { current: true };

        load(isActiveRef);

        return () => {
            isActiveRef.current = false;
        };
    }, [load]);

    const updateNote = useCallback(
        (updatedNote: string) => {
            const trimmedNote = updatedNote.trim();
            const initialNote = (wineModel.review?.initialAiTastingNote || '').trim();
            const hasEdited = Boolean(trimmedNote) && trimmedNote !== initialNote;

            if (trimmedNote) {
                setNoteValidationError(null);
            }

            setNote(updatedNote);
            patchReview({
                aiTastingNote: updatedNote,
                hasEditedAiTastingNote: hasEdited,
            });
        },
        [patchReview],
    );

    const resetToEventDetails = useCallback(() => {
        if (!eventId) return;

        const state = navigation.getState();
        const eventDetailsParams = { eventId };
        const routesToDrop = new Set([
            'TastingWineLookView',
            'TastingWineSmellView',
            'TastingWineTasteView',
            'TastingWineTasteCharacteristicsView',
            'TastingWineReviewView',
            'TastingWineReviewResultView',
        ]);
        const eventDetailsIndex = state.routes.findIndex(route => route.name === 'EventDetailsView');

        if (eventDetailsIndex >= 0) {
            const updatedRoutes = state.routes.map(route =>
                route.name === 'EventDetailsView' ? { ...route, params: eventDetailsParams } : route,
            );
            const routes = updatedRoutes.slice(0, eventDetailsIndex + 1);

            navigation.dispatch(
                CommonActions.reset({
                    ...state,
                    routes,
                    index: routes.length - 1,
                }),
            );
            return;
        }

        const routes = [
            ...state.routes.filter(route => !routesToDrop.has(route.name)),
            { name: 'EventDetailsView', params: eventDetailsParams },
        ];

        navigation.dispatch(
            CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            }),
        );
    }, [eventId, navigation]);

    const onSavePress = useCallback(async () => {
        const editedAiNote = wineModel.review?.aiTastingNote?.trim() || '';
        if (isNoteEditing && !editedAiNote) {
            setNoteValidationError(localization.t('wine.emptyTastingNoteError'));
            return;
        }

        setNoteValidationError(null);

        try {
            setIsSaving(true);

            if (eventId && wineId) {
                const response = await eventTastingService.saveDraft({
                    eventId,
                    wineId,
                    data: buildEventTastingDraftPayload(wineId),
                    isFinal: true,
                });

                if (response.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }

                skipNextBlurSave();
                resetToEventDetails();
                clearTasteCharacteristicsCache();
                clearWineSnackCuisinesCache();
                clearWineModel();
                return;
            }

            const available = isPremiumUser
                ? wineModel.tasteCharacteristics
                : wineModel.tasteCharacteristics?.filter(item => !item.isPremium);

            const aromas = wineModel.selectedSmells?.filter(item => item.colorHex)?.map(item => item.id);
            const suggestedAromas = wineModel.selectedSmells
                ?.filter(item => !item.colorHex)
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

            if (wineModel.winePeak !== null) {
                payload.winePeak = wineModel.winePeak;
            }

            if (userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER) {
                const starRate = wineModel.review?.starRate ?? 0;
                if (typeof starRate === 'number' && !Number.isNaN(starRate)) {
                    payload.userRating = Number(starRate.toFixed(1));
                }
            } else {
                const expertRating = wineModel.review?.rate ?? DEFAULT_EXPERT_RATING;
                if (typeof expertRating === 'number' && !Number.isNaN(expertRating)) {
                    payload.expertRating = expertRating;
                }
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

            if (wineModel.review?.aiTastingNote) {
                payload.aiTastingNote = wineModel.review.aiTastingNote;
            }

            if (wineModel.review?.aiSnacks) {
                payload.aiSnacks = wineModel.review.aiSnacks;
            }

            const response = await wineService.addToRate(payload);

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
                skipNextBlurSave();
                const state = navigation.getState();
                const hasDetailsScreen = state.routes.some(route => route.name === 'WineDetailsView');
                const wineDetailsParams = { wineId: wineModel.wine?.id, vintages: 'All' };
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
                            route.name === 'WineDetailsView' ? { ...route, params: wineDetailsParams } : route,
                        );
                        const detailsIndex = updatedRoutes.findIndex(r => r.name === 'WineDetailsView');
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
                clearWineModel();
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsSaving(false);
        }
    }, [buildEventTastingDraftPayload, eventId, isPremiumUser, isNoteEditing, navigation, resetToEventDetails, skipNextBlurSave, wineId]);

    const onNoteEditingChange = useCallback(
        (isEditing: boolean) => {
            setIsNoteEditing(isEditing);

            if (!isEditing) {
                setNoteValidationError(null);
                saveEventTastingDraft();
            }
        },
        [saveEventTastingDraft],
    );

    const onInvalidNoteEditingComplete = useCallback(() => {
        setIsNoteEditing(true);
        setNoteValidationError(localization.t('wine.emptyTastingNoteError'));
    }, []);
    const onSubscribePress = useCallback(() => {}, []);

    return {
        onSavePress,
        note,
        isLoading,
        isSaving,
        limits,
        isLoadingLimits,
        getNote,
        setLimits,
        updateNote,
        noteValidationError,
        onNoteEditingChange,
        onInvalidNoteEditingComplete,
        onSubscribePress,
        isSelectedParametersVisible,
        saveEventTastingDraft,
        isCuisineModalVisible,
        isLoadingCuisines,
        cuisineOptions,
        cuisineSelectButtonText,
        onOpenCuisinePickerPress,
        onCloseCuisinePicker,
        onConfirmCuisineSelection,
        snacks,
        isGeneratingSnacks,
        onGenerateSnacksPress,
    };
};
