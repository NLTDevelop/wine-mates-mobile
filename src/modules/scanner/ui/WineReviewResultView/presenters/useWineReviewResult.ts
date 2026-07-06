/* eslint-disable react-hooks/set-state-in-effect */
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';
import { wineService } from '@/entities/wine/services/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { GenerateNoteDto } from '@/entities/wine/dto/GenerateNote.dto';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IRateContext } from '@/entities/wine/types/IRateContext';
import { useWineRateSubmit } from '@/modules/scanner/presenters/useWineRateSubmit';
import { snackService } from '@/entities/snacks/SnackService';
import { IWineSnackCuisine } from '@/entities/snacks/types/IWineSnackCuisine';
import { IWineSnackCuisineOption } from '@/entities/snacks/types/IWineSnackCuisineOption';
import { useFoodPairing } from '@/UIKit/FoodPairing/presenters/useFoodPairing';
import {
    clearWineSnackCuisinesCache,
    getWineSnackCuisinesCache,
    IWineSnackCuisineCacheItem,
    setWineSnackCuisinesCache,
} from '@/libs/storage/cacheUtils';
import { wineModel } from '@/entities/wine/models/WineModel';

const DEFAULT_EXPERT_RATING = 70;

export const useWineReviewResult = () => {
    const { saveWineRate } = useWineRateSubmit();
    const cuisineCacheWineId = wineModel.wine?.id;
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
    } = useFoodPairing(setLimits, wineModel.review?.aiSnacks || undefined, undefined, selectedCuisineNames);

    const patchReview = useCallback((payload: Partial<NonNullable<typeof wineModel.review>>) => {
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            ...payload,
        };
    }, []);

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

            const suggestedAromas = (wineModel.selectedSmells || [])
                .filter(item => !item.colorHex && item.name?.trim())
                .map(item => item.name.trim());
            const suggestedFlavors = (wineModel.selectedTastes || [])
                .filter(item => !item.colorHex && item.name?.trim())
                .map(item => item.name.trim());

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
                const generatedNote = response.data.note || null;
                setNote(generatedNote);
                patchReview({
                    aiTastingNote: generatedNote,
                    initialAiTastingNote: generatedNote,
                    hasEditedAiTastingNote: false,
                });
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, [patchReview]);

    const load = useCallback(async (isActiveRef: { current: boolean }) => {
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

        if (limitsData?.aiUsage.left === 0) {
            setIsLoading(false);
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

    const updateNote = useCallback((updatedNote: string) => {
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
    }, [patchReview]);

    const onSavePress = useCallback(async () => {
        const editedAiNote = wineModel.review?.aiTastingNote?.trim() || '';
        if (isNoteEditing && !editedAiNote) {
            setNoteValidationError(localization.t('wine.emptyTastingNoteError'));
            return;
        }

        setNoteValidationError(null);

        try {
            setIsSaving(true);
            const isSaved = await saveWineRate();

            if (isSaved) {
                clearWineSnackCuisinesCache();
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsSaving(false);
        }
    }, [saveWineRate, isNoteEditing]);

    const onNoteEditingChange = useCallback((isEditing: boolean) => {
        setIsNoteEditing(isEditing);

        if (!isEditing) {
            setNoteValidationError(null);
        }
    }, []);

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
