import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { wineService } from '@/entities/wine/services/WineService';
import { myWineService } from '@/entities/wine/services/MyWineService';
import { toastService } from '@/libs/toast/toastService';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { localization } from '@/UIProvider/localization/Localization';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NONE_VINTAGE_DROPDOWN_VALUE } from './useVintageDropdown';
import { wineModel } from '@/entities/wine/models/WineModel';
import { clearWineReviewsListModel } from '@/entities/wine/services/WineModelService';
import { IRateDetails } from '@/entities/wine/types/IRateDetails';
import { userModel } from '@/entities/users/UserModel';
import { useGallery } from '@/UIKit/Gallery/presenters/useGallery';
import { IGalleryPhoto } from '@/UIKit/Gallery/types/IGalleryPhoto';

type WineDetailsRouteParams = {
    wineId?: number;
    fromScanner?: boolean;
    wineDetailsData?: IWineDetails;
    openedFromDeepLink?: boolean;
    notificationRateId?: number;
    vintages?: 'All';
};

const getRateColorStatistics = (rateDetails: IRateDetails): IWineDetails['statistics']['topColors'] => {
    if (!rateDetails.color?.tone) {
        return [];
    }

    const emptyShade = {
        colorHex: rateDetails.color.colorHex,
        userCount: 0,
    };
    const selectedShade = {
        colorHex: rateDetails.color.colorHex,
        userCount: 1,
    };

    return [{
        id: rateDetails.color.id,
        colorHex: rateDetails.color.colorHex,
        name: rateDetails.color.name,
        pale: rateDetails.color.tone === 'pale' ? selectedShade : emptyShade,
        medium: rateDetails.color.tone === 'medium' ? selectedShade : emptyShade,
        deep: rateDetails.color.tone === 'deep' ? selectedShade : emptyShade,
    }];
};

const mergeRateDetails = (wineDetails: IWineDetails, rateDetails: IRateDetails): IWineDetails => {
    return {
        ...wineDetails,
        averageUserRating: rateDetails.userRating,
        averageExpertRating: rateDetails.expertRating,
        countUserRating: rateDetails.userRating === null ? 0 : 1,
        countExpertRating: rateDetails.expertRating === null ? 0 : 1,
        totalReviews: 1,
        isTasted: true,
        myReview: {
            id: rateDetails.id,
            userRating: rateDetails.userRating,
            expertRating: rateDetails.expertRating,
            review: rateDetails.review,
            createdAt: rateDetails.createdAt,
            user: rateDetails.user,
        },
        statistics: {
            topColors: getRateColorStatistics(rateDetails),
            topAromas: rateDetails.aromas.map(item => ({ ...item, userCount: 1 })),
            topFlavors: rateDetails.flavors.map(item => ({ ...item, userCount: 1 })),
            tasteCharacteristics: rateDetails.tasteCharacteristics,
            topWinePeaks: rateDetails.winePeak === null ? [] : [{ year: rateDetails.winePeak, userCount: 1 }],
        },
    };
};

export const useWineDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {
        wineId,
        fromScanner,
        wineDetailsData,
        openedFromDeepLink,
        notificationRateId,
        vintages: routeVintages,
    } = (route.params as WineDetailsRouteParams | undefined) || {};
    const initialVintages = notificationRateId ? undefined : routeVintages;
    const [details, setDetails] = useState<IWineDetails | null>(null);
    const [isError, setIsError] = useState(false);
    const [isAllVintagesSelected, setIsAllVintagesSelected] = useState(initialVintages === 'All');
    const [hasSelectedVintageData, setHasSelectedVintageData] = useState(true);
    const [isVintageChanging, setIsVintageChanging] = useState(false);
    const [localIsSaved, setLocalIsSaved] = useState<boolean | undefined>(undefined);
    const [rateId, setRateId] = useState<number | null>(null);
    const isResettingRef = useRef(false);

    const getDetails = useCallback(async (params?: { vintages?: 'All' }) => {
        try {
            if (notificationRateId) {
                const rateResponse = await wineService.getRateDetails(notificationRateId);

                if (rateResponse.isError || !rateResponse.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        rateResponse.message || localization.t('common.somethingWentWrong'),
                    );
                    setIsError(true);
                    return;
                }

                const wineResponse = await wineService.getById(rateResponse.data.wineId);

                if (wineResponse.isError || !wineResponse.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        wineResponse.message || localization.t('common.somethingWentWrong'),
                    );
                    setIsError(true);
                    return;
                }

                const notificationDetails = mergeRateDetails(wineResponse.data, rateResponse.data);
                wineModel.selectedWineId = rateResponse.data.wineId;
                setDetails(notificationDetails);
                wineModel.vintages = notificationDetails.vintages;
                setLocalIsSaved(notificationDetails.isSaved);
                setIsError(false);
                return;
            }

            if (!wineModel.selectedWineId) return;

            const detailsParams = {
                rateId,
                vintages: params ? params.vintages : undefined,
            }; 

            const response = rateId
                ? await myWineService.getMyWineDetails(wineModel.selectedWineId, detailsParams)
                : await wineService.getById(wineModel.selectedWineId, params);

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                setIsError(true);
            } else {
                setDetails(response.data);
                wineModel.vintages = response.data.vintages;
                setLocalIsSaved(response.data.isSaved);
                setIsError(false);
            }
        } catch (error) {
            console.error('getTastes error: ', JSON.stringify(error, null, 2));
        } finally {
            
        }
    }, [notificationRateId, rateId]);

    const getVintageDetails = useCallback(async (params?: { vintages?: 'All' }) => {
        try {
            await getDetails(params);
        } finally {
            setIsVintageChanging(false);
        }
    }, [getDetails]);

    const onVintageChange = useCallback(async (item: IDropdownItem) => {
        const isNoneVintage = item.value === NONE_VINTAGE_DROPDOWN_VALUE;
        const isAllVintages = item.value === null
            || (typeof item.label === 'string' && item.label.toLowerCase() === localization.t('wine.allVintages').toLowerCase())
            || (typeof item.value === 'string' && item.value.toLowerCase() === 'all');

        setIsVintageChanging(true);

        if (isAllVintages) {
            setIsAllVintagesSelected(true);
            setHasSelectedVintageData(true);
            await getVintageDetails({ vintages: 'All' });
            return;
        }

        setIsAllVintagesSelected(false);
        const selectedWineId = item.id ? Number(item.id) : null;
        const selectedVintage = isNoneVintage || item.value === null ? null : Number(item.value);

        if (selectedWineId && selectedWineId !== wineModel.selectedWineId) {
            setHasSelectedVintageData(true);
            wineModel.selectedWineId = selectedWineId;
            await getVintageDetails();
            return;
        }

        if (selectedWineId && selectedWineId === wineModel.selectedWineId) {
            setHasSelectedVintageData(true);
            await getVintageDetails();
            return;
        }

        if (selectedVintage !== null && Number.isNaN(selectedVintage)) {
            setIsVintageChanging(false);
            return;
        }

        setHasSelectedVintageData(false);
        if (details) {
            setDetails({
                ...details,
                vintage: selectedVintage,
                isTasted: false,
                currentVintage: null,
                averageUserRating: 0,
                averageExpertRating: 0,
                countUserRating: 0,
                countExpertRating: 0,
                totalReviews: 0,
                aiTastingNote: undefined,
                aiSnacks: [],
                myReview: null,
                statistics: {
                    topColors: [],
                    topAromas: [],
                    topFlavors: [],
                    tasteCharacteristics: [],
                    topWinePeaks: [],
                },
            });
            clearWineReviewsListModel();
        }
        setIsVintageChanging(false);
    }, [details, getVintageDetails]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            if (wineDetailsData) {
                setIsAllVintagesSelected(initialVintages === 'All');
                setHasSelectedVintageData(true);
                wineModel.selectedWineId = wineDetailsData.id;
                setDetails(wineDetailsData);
                wineModel.vintages = wineDetailsData.vintages;
                setLocalIsSaved(wineDetailsData.isSaved);
                setRateId(wineDetailsData.myReview?.id ?? null);
                setIsError(false);
                return;
            }

            if (!wineId && !notificationRateId) return;

            setIsAllVintagesSelected(initialVintages === 'All');
            setHasSelectedVintageData(true);
            if (wineId) {
                wineModel.selectedWineId = wineId;
            }
            getDetails(initialVintages ? { vintages: initialVintages } : undefined);
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [wineId, wineDetailsData, notificationRateId, initialVintages, getDetails]);

    const hasCurrentVintageData = !!details?.currentVintage && typeof details.currentVintage === 'object';
    const reviewsWineId = hasSelectedVintageData
        ? wineModel.selectedWineId ?? wineId ?? null
        : null;

    const detailsWithLocalIsSaved = details ? {
        ...details,
        isSaved: localIsSaved ?? details.isSaved,
    } : null;

    const wineImagePhotos = useMemo<IGalleryPhoto[]>(() => {
        const image = details?.image || details?.defaultImage;
        const uri = image?.originalUrl || image?.mediumUrl || image?.smallUrl;

        if (!uri || !details) {
            return [];
        }

        return [{
            id: `wine-details-image-${details.id}`,
            uri,
        }];
    }, [details]);
    const wineImageGallery = useGallery({ photos: wineImagePhotos });
    const onWineImagePress = wineImageGallery.items[0]?.onPress;

    const hasPremiumContentAccess = Boolean(
        userModel.user?.hasPremium ||
        (details?.wineryUserId && details.wineryUserId === userModel.user?.id),
    );

    const onUpdateIsSaved = useCallback((isSaved: boolean) => {
        setLocalIsSaved(isSaved);
    }, []);

    const resetToHome = useCallback(() => {
        isResettingRef.current = true;
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'TabNavigator',
                        state: {
                            index: 0,
                            routes: [
                                {
                                    name: 'HomeStack',
                                    state: {
                                        index: 0,
                                        routes: [{ name: 'HomeView' }],
                                    },
                                },
                            ],
                        },
                    },
                ],
            }),
        );
    }, [navigation]);

    const onPressBack = useCallback(() => {
        if (openedFromDeepLink && !navigation.canGoBack()) {
            resetToHome();
            return;
        }

        navigation.goBack();
    }, [navigation, openedFromDeepLink, resetToHome]);

    useEffect(() => {
        if (!openedFromDeepLink) {
            return undefined;
        }

        return navigation.addListener('beforeRemove', (event) => {
            if (isResettingRef.current) {
                return;
            }

            if (navigation.canGoBack()) {
                return;
            }

            event.preventDefault();
            resetToHome();
        });
    }, [navigation, openedFromDeepLink, resetToHome]);

    return {
        details: detailsWithLocalIsSaved,
        vintages: wineModel.vintages ?? [],
        isError,
        getDetails,
        onVintageChange,
        hasCurrentVintageData,
        hasSelectedVintageData,
        isVintageChanging,
        isAllVintagesSelected,
        wineId,
        selectedWineId: wineModel.selectedWineId,
        reviewsWineId,
        fromScanner,
        onUpdateIsSaved,
        isPreloadedData: Boolean(wineDetailsData || notificationRateId),
        isResultHeaderFooterVisible: !notificationRateId,
        showTastingAuthor: Boolean(notificationRateId),
        myReview: details?.myReview ?? null,
        hasPremiumContentAccess,
        hasPremiumSubscription: Boolean(userModel.user?.hasPremium),
        onPressBack,
        wineImageGallery,
        onWineImagePress,
    };
};
