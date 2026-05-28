/* eslint-disable react-hooks/set-state-in-effect */
import { wineModel } from '@/entities/wine/WineModel';
import { eventTastingService } from '@/entities/events/EventTastingService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useEventTastingDraft } from '@/modules/tastings/presenters/useEventTastingDraft';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { wineService } from '@/entities/wine/WineService';
import { WineSetTastingStatus } from '@/entities/events/types/IWineSetItem';
import { clearTasteCharacteristicsCache } from '@/libs/storage/cacheUtils';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';
import { AddRateDto } from '@/entities/wine/dto/AddRate.dto';

interface IRouteParams {
    source?: string;
    wineId?: number;
    eventId?: number;
    isBlindTasting?: boolean;
    tastingStatus?: WineSetTastingStatus;
    isFullTastingReview?: boolean;
}

type ReviewOnlyDraftPayload = Pick<Partial<AddRateDto>, 'wineId' | 'review' | 'userRating' | 'expertRating'>;

export const useTastingWineReview = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const routeParams = (route.params as IRouteParams | undefined) || {};
    const source = routeParams.source ?? 'eventTasting';
    const wineId = routeParams.wineId;
    const eventId = routeParams.eventId;
    const tastingStatus = routeParams.tastingStatus ?? 'not_started';
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
    const [hasChangedRate, setHasChangedRate] = useState(() => wineModel.review?.hasChangedRate ?? false);
    const [hasChangedStarRate, setHasChangedStarRate] = useState(() => wineModel.review?.hasChangedStarRate ?? false);
    const [isSaving, setIsSaving] = useState(false);

    const applyDraftReview = useCallback((draftReview: {
        review?: string;
        expertRating?: number;
        userRating?: number;
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

        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            review: nextReview,
            rate: nextSliderValue,
            starRate: nextStarRate,
            hasChangedRate: nextHasChangedRate,
            hasChangedStarRate: nextHasChangedStarRate,
        };
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

        wineModel.clear();
        applyWineDetailsToTastingModel(wineResponse.data);

        if (tastingStatus !== 'in_progress') {
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

    const onSliderChange = useCallback((value: number) => {
        setSliderValue(value);
        setHasChangedRate(true);
    }, []);

    const onChangeReview = useCallback((text: string) => {
        setReview(text);
    }, []);

    const onStarRateChange = useCallback((value: number) => {
        const newValue = Number(value.toFixed(1));
        setStarRate(prev => prev === newValue ? prev : newValue);
        setHasChangedStarRate(true);
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

    const saveEventTastingDraft = useCallback(async (isFinal: boolean, data?: Partial<AddRateDto>) => {
        if (!eventId || !wineId) {
            return true;
        }

        setIsSaving(true);

        try {
            const response = await eventTastingService.saveDraft({
                eventId,
                wineId,
                data: data || buildEventTastingDraftPayload(wineId),
                isFinal,
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
    }, [buildEventTastingDraftPayload, eventId, wineId]);

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

    const onContinueFullTastingPress = useCallback(async () => {
        saveReview();
        const draftPayload = tastingStatus === 'in_progress' ? undefined : buildReviewOnlyDraftPayload();
        const isSaved = await saveEventTastingDraft(false, draftPayload);
        if (!isSaved) {
            return;
        }

        navigation.navigate('TastingWineLookView', {
            source,
            wineId,
            eventId,
            tastingStatus: 'in_progress',
            isBlindTasting: routeParams.isBlindTasting,
        });
    }, [
        buildReviewOnlyDraftPayload,
        eventId,
        navigation,
        routeParams.isBlindTasting,
        saveEventTastingDraft,
        saveReview,
        source,
        tastingStatus,
        wineId,
    ]);

    const onFinishTastingPress = useCallback(async () => {
        saveReview();
        const isSaved = await saveReviewOnlyFinalDraft();
        if (!isSaved) {
            return;
        }

        resetToEventDetails();
        clearTasteCharacteristicsCache();
        wineModel.clear();
    }, [resetToEventDetails, saveReview, saveReviewOnlyFinalDraft]);

    const onNextPress = useCallback(async () => {
        saveReview();

        if (eventId && wineId) {
            const isSaved = await saveEventTastingDraft(false);
            if (!isSaved) {
                return;
            }

            navigation.navigate('TastingWineReviewResultView', {
                source,
                wineId,
                eventId,
                isBlindTasting: routeParams.isBlindTasting,
            });
            return;
        }

        navigation.navigate('WineReviewResultView');
    }, [
        eventId,
        navigation,
        routeParams.isBlindTasting,
        saveEventTastingDraft,
        saveReview,
        source,
        wineId,
    ]);

    return {
        review,
        onChangeReview,
        onSliderChange,
        onNextPress,
        sliderValue,
        starRate,
        onStarRateChange,
        isSaving,
        isSelectedParametersVisible,
        onContinueFullTastingPress,
        onFinishTastingPress,
        isFullTastingReview,
    };
};
