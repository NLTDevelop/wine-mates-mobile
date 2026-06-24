/* eslint-disable react-hooks/set-state-in-effect */
import { eventTastingService } from '@/entities/events/EventTastingService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useEventTastingDraft } from '@/modules/tastings/presenters/useEventTastingDraft';
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { wineService } from '@/entities/wine/services/WineService';
import { WineSetTastingStatus } from '@/entities/events/types/IWineSetItem';
import { clearTasteCharacteristicsCache } from '@/libs/storage/cacheUtils';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';
import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';
import { Keyboard } from 'react-native';
import { runInAction } from 'mobx';
import { wineModel } from '@/entities/wine/models/WineModel';
import { clearWineModel } from '@/entities/wine/services/WineModelService';
import { useSaveEventTastingDraftOnBlur } from '@/modules/tastings/presenters/useSaveEventTastingDraftOnBlur';

interface IRouteParams {
    source?: string;
    wineId?: number;
    eventId?: number;
    isBlindTasting?: boolean;
    tastingStatus?: WineSetTastingStatus;
    isFullTastingReview?: boolean;
}

type ReviewOnlyDraftPayload = Pick<Partial<AddRateDto>, 'wineId' | 'review' | 'userRating' | 'expertRating' | 'winePeak'>;

export const useTastingWineReview = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const routeParams = (route.params as IRouteParams | undefined) || {};
    const source = routeParams.source ?? 'eventTasting';
    const wineId = routeParams.wineId;
    const eventId = routeParams.eventId;
    const tastingStatus = routeParams.tastingStatus ?? 'not_started';
    const isEditingFinishedTasting = tastingStatus === 'tasted';
    const nextTastingStatus: WineSetTastingStatus = isEditingFinishedTasting ? 'tasted' : 'in_progress';
    const isFullTastingReview = routeParams.isFullTastingReview || false;
    const isSelectedParametersVisible = !routeParams.isBlindTasting;
    const {
        applyEventTastingDraftToModel,
        applyWineDetailsToTastingModel,
        buildEventTastingDraftPayload,
        getDefaultEventTastingDraft,
        getEventTastingDraftData,
    } = useEventTastingDraft();

    const [review, setReview] = useState(() => wineModel.review?.review ?? '');
    const [sliderValue, setSliderValue] = useState(() => wineModel.review?.rate ?? 70);
    const [starRate, setStarRate] = useState(() => wineModel.review?.starRate ?? 0);
    const [winePeak, setWinePeak] = useState<number | null>(wineModel.winePeak);
    const [hasChangedRate, setHasChangedRate] = useState(() => wineModel.review?.hasChangedRate ?? false);
    const [hasChangedStarRate, setHasChangedStarRate] = useState(() => wineModel.review?.hasChangedStarRate ?? false);
    const [isSaving, setIsSaving] = useState(false);
    const [ratingSliderKey, setRatingSliderKey] = useState(0);
    const [ratingStarsKey, setRatingStarsKey] = useState(0);
    const isExpertOrWinemaker = userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.EXPERT ||
        userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.CREATOR;
    const isWinePeakPickerVisible = isExpertOrWinemaker && !isFullTastingReview;

    const applyDraftReview = useCallback((draftReview: {
        review?: string;
        expertRating?: number;
        userRating?: number;
        winePeak?: number;
    }) => {
        const nextReview = draftReview.review || '';
        const nextSliderValue = typeof draftReview.expertRating === 'number'
            ? draftReview.expertRating
            : wineModel.review?.rate ?? 70;
        const nextStarRate = typeof draftReview.userRating === 'number'
            ? draftReview.userRating
            : wineModel.review?.starRate ?? 0;
        const nextHasChangedRate = typeof draftReview.expertRating === 'number';
        const nextHasChangedStarRate = typeof draftReview.userRating === 'number';

        setReview(nextReview);
        setSliderValue(nextSliderValue);
        setStarRate(nextStarRate);
        setHasChangedRate(nextHasChangedRate);
        setHasChangedStarRate(nextHasChangedStarRate);
        setWinePeak(typeof draftReview.winePeak === 'number' ? draftReview.winePeak : wineModel.winePeak);
        if (typeof draftReview.expertRating === 'number') {
            setRatingSliderKey(prevState => prevState + 1);
        }
        if (typeof draftReview.userRating === 'number') {
            setRatingStarsKey(prevState => prevState + 1);
        }

        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            review: nextReview,
            rate: nextSliderValue,
            starRate: nextStarRate,
            hasChangedRate: nextHasChangedRate,
            hasChangedStarRate: nextHasChangedStarRate,
        };
        wineModel.winePeak = typeof draftReview.winePeak === 'number' ? draftReview.winePeak : wineModel.winePeak;
    }, []);

    const syncReviewFromModel = useCallback(() => {
        const nextReview = wineModel.review?.review ?? '';
        const nextSliderValue = wineModel.review?.rate ?? 70;
        const nextStarRate = wineModel.review?.starRate ?? 0;
        const nextHasChangedRate = wineModel.review?.hasChangedRate ?? false;
        const nextHasChangedStarRate = wineModel.review?.hasChangedStarRate ?? false;

        setReview(nextReview);
        setSliderValue(nextSliderValue);
        setStarRate(nextStarRate);
        setHasChangedRate(nextHasChangedRate);
        setHasChangedStarRate(nextHasChangedStarRate);
        setWinePeak(wineModel.winePeak);
        setRatingSliderKey(prevState => prevState + 1);
        setRatingStarsKey(prevState => prevState + 1);
    }, []);

    const getEventTastingDraft = useCallback(async () => {
        if (isFullTastingReview) return;
        if (!eventId || !wineId) return;

        const wineResponse = await wineService.getById(wineId);

        if (wineResponse.isError || !wineResponse.data) {
            toastService.showError(
                localization.t('common.errorHappened'),
                wineResponse.message || localization.t('common.somethingWentWrong'),
            );
            return;
        }

        clearWineModel();
        applyWineDetailsToTastingModel(wineResponse.data);

        if (tastingStatus !== 'in_progress' && tastingStatus !== 'tasted') {
            applyEventTastingDraftToModel(getDefaultEventTastingDraft(wineId), wineId);
            applyDraftReview({});
            return;
        }

        const response = await eventTastingService.getDraft({
            eventId,
            wineId,
        });

        if (response.isError) {
            return;
        }

        const draft = getEventTastingDraftData(response.data);
        applyEventTastingDraftToModel(draft, wineId);
        applyDraftReview(draft);
    }, [
        applyDraftReview,
        applyEventTastingDraftToModel,
        applyWineDetailsToTastingModel,
        eventId,
        getDefaultEventTastingDraft,
        getEventTastingDraftData,
        isFullTastingReview,
        tastingStatus,
        wineId,
    ]);

    useEffect(() => {
        getEventTastingDraft();
    }, [getEventTastingDraft]);

    useFocusEffect(
        useCallback(() => {
            syncReviewFromModel();
        }, [syncReviewFromModel]),
    );

    const onSliderChange = useCallback((value: number) => {
        setSliderValue(value);
        setHasChangedRate(true);
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            rate: value,
            hasChangedRate: true,
        };
    }, []);

    const onChangeReview = useCallback((text: string) => {
        setReview(text);
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            review: text,
        };
    }, []);

    const onStarRateChange = useCallback((value: number) => {
        const newValue = Number(value.toFixed(1));
        setStarRate(prev => prev === newValue ? prev : newValue);
        setHasChangedStarRate(true);
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            starRate: newValue,
            hasChangedStarRate: true,
        };
    }, []);

    const onWinePeakChange = useCallback((year: number | null) => {
        setWinePeak(year);
        runInAction(() => {
            wineModel.winePeak = year;
        });
        Keyboard.dismiss();
    }, []);

    const saveReview = useCallback(() => {
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            starRate,
            rate: sliderValue,
            review,
            hasChangedRate,
            hasChangedStarRate,
        };
    }, [hasChangedRate, hasChangedStarRate, review, sliderValue, starRate]);

    const { skipNextBlurSave } = useSaveEventTastingDraftOnBlur({
        eventId,
        wineId,
        buildPayload: buildEventTastingDraftPayload,
        isFinal: isEditingFinishedTasting,
        onBeforeSave: saveReview,
    });

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
        const eventDetailsIndex = state.routes.findIndex(stateRoute => stateRoute.name === 'EventDetailsView');

        if (eventDetailsIndex >= 0) {
            const updatedRoutes = state.routes.map(stateRoute =>
                stateRoute.name === 'EventDetailsView' ? { ...stateRoute, params: eventDetailsParams } : stateRoute,
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
            ...state.routes.filter(stateRoute => !routesToDrop.has(stateRoute.name)),
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

    const buildReviewOnlyDraftPayload = useCallback((): ReviewOnlyDraftPayload => {
        const payload: ReviewOnlyDraftPayload = {
            wineId,
            review: wineModel.review?.review.trim() || '',
        };

        if (userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER) {
            const nextStarRate = wineModel.review?.starRate ?? 0;
            if (typeof nextStarRate === 'number' && !Number.isNaN(nextStarRate)) {
                payload.userRating = Number(nextStarRate.toFixed(1));
            }
        } else if (wineModel.review?.hasChangedRate && wineModel.review?.rate) {
            payload.expertRating = wineModel.review.rate;
        }

        if (wineModel.winePeak !== null) {
            payload.winePeak = wineModel.winePeak;
        }

        return payload;
    }, [wineId]);

    const saveReviewOnlyFinalDraft = useCallback(async () => {
        if (!eventId || !wineId) {
            return true;
        }

        setIsSaving(true);

        try {
            const response = await eventTastingService.saveDraft({
                eventId,
                wineId,
                data: buildReviewOnlyDraftPayload(),
                isFinal: true,
            });

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return false;
            }

            return true;
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [buildReviewOnlyDraftPayload, eventId, wineId]);

    const onContinueFullTastingPress = useCallback(() => {
        saveReview();

        navigation.navigate('TastingWineLookView', {
            source,
            wineId,
            eventId,
            tastingStatus: nextTastingStatus,
            isBlindTasting: routeParams.isBlindTasting,
        });
    }, [
        eventId,
        navigation,
        routeParams.isBlindTasting,
        saveReview,
        source,
        nextTastingStatus,
        wineId,
    ]);

    const onFinishTastingPress = useCallback(async () => {
        saveReview();
        const isSaved = await saveReviewOnlyFinalDraft();
        if (!isSaved) {
            return;
        }

        skipNextBlurSave();
        resetToEventDetails();
        clearTasteCharacteristicsCache();
        clearWineModel();
    }, [resetToEventDetails, saveReview, saveReviewOnlyFinalDraft, skipNextBlurSave]);

    const onNextPress = useCallback(() => {
        saveReview();

        if (eventId && wineId) {
            navigation.navigate('TastingWineReviewResultView', {
                source,
                wineId,
                eventId,
                isBlindTasting: routeParams.isBlindTasting,
                tastingStatus: nextTastingStatus,
            });
            return;
        }

        navigation.navigate('WineReviewResultView');
    }, [
        eventId,
        navigation,
        routeParams.isBlindTasting,
        saveReview,
        source,
        nextTastingStatus,
        wineId,
    ]);

    return {
        review,
        onChangeReview,
        onSliderChange,
        onNextPress,
        sliderValue,
        starRate,
        winePeak,
        onStarRateChange,
        onWinePeakChange,
        isSaving,
        isSelectedParametersVisible,
        onContinueFullTastingPress,
        onFinishTastingPress,
        isFullTastingReview,
        isWinePeakPickerVisible,
        ratingSliderKey,
        ratingStarsKey,
    };
};
