/* eslint-disable react-hooks/set-state-in-effect */
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { GenerateNoteDto } from '@/entities/wine/dto/GenerateNote.dto';
import { useCallback, useEffect, useState } from 'react';
import { IRateContext } from '@/entities/wine/types/IRateContext';
import { useWineRateSubmit } from '@/modules/scanner/presenters/useWineRateSubmit';

export const useWineReviewResult = () => {
    const { saveWineRate } = useWineRateSubmit();
    const [isLoadingLimits, setIsLoadingLimits] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isNoteEditing, setIsNoteEditing] = useState(false);
    const [noteValidationError, setNoteValidationError] = useState<string | null>(null);
    const [note, setNote] = useState<string | null>(wineModel.review?.aiTastingNote || null);
    const [limits, setLimits] = useState<IRateContext | null>(null);
    const patchReview = useCallback((payload: Partial<NonNullable<typeof wineModel.review>>) => {
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            ...payload,
        };
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
                if (wineModel.review?.hasChangedRate && wineModel.review?.rate) {
                    payload.expertRating = wineModel.review.rate;
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
            await saveWineRate();
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
    };
};
