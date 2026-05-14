/* eslint-disable react-hooks/set-state-in-effect */
import { wineModel } from '@/entities/wine/WineModel';
import { eventTastingService } from '@/entities/events/EventTastingService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useEventTastingDraft } from '@/modules/tastings/presenters/useEventTastingDraft';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';

interface IRouteParams {
    source?: string;
    wineId?: number;
    eventId?: number;
    isBlindTasting?: boolean;
}

export const useTastingWineReview = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const routeParams = (route.params as IRouteParams | undefined) || {};
    const source = routeParams.source ?? 'eventTasting';
    const wineId = routeParams.wineId;
    const eventId = routeParams.eventId;
    const isSelectedParametersVisible = !routeParams.isBlindTasting;
    const { buildEventTastingDraftPayload, getEventTastingDraftData } = useEventTastingDraft();

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
        if (!eventId || !wineId) return;

        const response = await eventTastingService.getDraft({
            eventId,
            wineId,
        });

        if (response.isError) {
            return;
        }

        const draft = getEventTastingDraftData(response.data);
        applyDraftReview(draft);
    }, [applyDraftReview, eventId, getEventTastingDraftData, wineId]);

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

    const onNextPress = useCallback(async () => {
        wineModel.review = {
            ...(wineModel.review || { review: '' }),
            starRate,
            rate: sliderValue,
            review,
            hasChangedRate,
            hasChangedStarRate,
        };

        if (eventId && wineId) {
            setIsSaving(true);

            try {
                const response = await eventTastingService.saveDraft({
                    eventId,
                    wineId,
                    data: buildEventTastingDraftPayload(wineId),
                    isFinal: false,
                });

                if (response.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }
            } catch (error) {
                console.error(JSON.stringify(error, null, 2));
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
                return;
            } finally {
                setIsSaving(false);
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
        buildEventTastingDraftPayload,
        eventId,
        hasChangedRate,
        hasChangedStarRate,
        navigation,
        review,
        routeParams.isBlindTasting,
        sliderValue,
        source,
        starRate,
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
    };
};
