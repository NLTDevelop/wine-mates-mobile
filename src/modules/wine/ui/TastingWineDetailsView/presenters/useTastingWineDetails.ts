/* eslint-disable react-hooks/set-state-in-effect */
import { IWineDetails, IVintage } from '@/entities/wine/types/IWineDetails';
import { wineService } from '@/entities/wine/services/WineService';
import { myWineService } from '@/entities/wine/services/MyWineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { wineModel } from '@/entities/wine/models/WineModel';

interface IEventVintageResponse extends IVintage {
    avgExpertRating?: number | null;
    avgUserRating?: number | null;
}

const isEventVintageResponse = (value: IWineDetails['currentVintage']): value is IEventVintageResponse => {
    return typeof value === 'object' && value !== null;
};

const normalizeEventDetails = (data: IWineDetails): IWineDetails => {
    if (!isEventVintageResponse(data.currentVintage)) {
        return data;
    }

    const currentVintage = {
        ...data.currentVintage,
        averageExpertRating: data.currentVintage.averageExpertRating ?? data.currentVintage.avgExpertRating ?? null,
        averageUserRating: data.currentVintage.averageUserRating ?? data.currentVintage.avgUserRating ?? null,
    };

    return {
        ...data,
        averageExpertRating: data.averageExpertRating ?? currentVintage.averageExpertRating,
        averageUserRating: data.averageUserRating ?? currentVintage.averageUserRating,
        countExpertRating: data.countExpertRating ?? currentVintage.countExpertRating,
        countUserRating: data.countUserRating ?? currentVintage.countUserRating,
        totalReviews: data.totalReviews ?? currentVintage.totalReviews,
        currentVintage,
    };
};

export const useTastingWineDetails = () => {
    const route = useRoute();
    const { wineId, eventId, wineDetailsData } = (route.params as {
        wineId?: number;
        eventId?: number;
        wineDetailsData?: IWineDetails;
    }) || { wineId: null, eventId: null, wineDetailsData: undefined };
    const isFocused = useIsFocused();
    const [details, setDetails] = useState<IWineDetails | null>(null);
    const [isError, setIsError] = useState(false);
    const [isAllVintagesSelected, setIsAllVintagesSelected] = useState(false);
    const [localIsSaved, setLocalIsSaved] = useState<boolean | undefined>(undefined);
    const [rateId, setRateId] = useState<number | null>(null);

    const getDetails = useCallback(async (params?: { vintages?: 'All' }) => {
        try {
            if (!wineModel.selectedWineId) return;

            const detailsParams = {
                rateId,
                vintages: params ? params.vintages : undefined,
            };

            const response = eventId
                ? await wineService.getEventDetails(wineModel.selectedWineId, { eventId })
                : rateId
                ? await myWineService.getMyWineDetails(wineModel.selectedWineId, detailsParams)
                : await wineService.getById(wineModel.selectedWineId, params);

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                setIsError(true);
            } else {
                const normalizedDetails = eventId ? normalizeEventDetails(response.data) : response.data;
                setDetails(normalizedDetails);
                wineModel.vintages = normalizedDetails.vintages;
                setLocalIsSaved(normalizedDetails.isSaved);
                setIsError(false);
            }
        } catch (error) {
            console.error('getTastes error: ', JSON.stringify(error, null, 2));
        } finally {
            
        }
    }, [eventId, rateId]);

    useEffect(() => {
        if (!isFocused) return;

        if (wineDetailsData) {
            const normalizedDetails = eventId ? normalizeEventDetails(wineDetailsData) : wineDetailsData;
            setIsAllVintagesSelected(false);
            wineModel.selectedWineId = normalizedDetails.id;
            setDetails(normalizedDetails);
            wineModel.vintages = normalizedDetails.vintages;
            setLocalIsSaved(normalizedDetails.isSaved);
            setRateId(normalizedDetails.myReview?.id ?? null);
            setIsError(false);
            return;
        }

        if (!wineId) return;

        setIsAllVintagesSelected(false);
        wineModel.selectedWineId = wineId;
        getDetails();
    }, [wineId, wineDetailsData, eventId, isFocused, getDetails]);

    const detailsWithLocalIsSaved = details ? {
        ...details,
        isSaved: localIsSaved ?? details.isSaved,
    } : null;

    return {
        details: detailsWithLocalIsSaved,
        isError,
        getDetails,
        isAllVintagesSelected,
        wineId,
        selectedWineId: wineModel.selectedWineId,
        isPreloadedData: !!wineDetailsData,
        myReview: details?.myReview ?? null,
        eventId,
    };
};
