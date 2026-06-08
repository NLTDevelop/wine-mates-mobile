import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { wineService } from '@/entities/wine/services/WineService';
import { myWineService } from '@/entities/wine/services/MyWineService';
import { toastService } from '@/libs/toast/toastService';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { localization } from '@/UIProvider/localization/Localization';
import { CommonActions, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NONE_VINTAGE_DROPDOWN_VALUE } from './useVintageDropdown';
import { wineModel } from '@/entities/wine/models/WineModel';
import { clearWineReviewsListModel } from '@/entities/wine/services/WineModelService';

export const useWineDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { wineId, fromScanner, wineDetailsData, openedFromDeepLink } = (route.params as { wineId?: number; fromScanner?: boolean; wineDetailsData?: IWineDetails; openedFromDeepLink?: boolean }) || { wineId: null, fromScanner: false, wineDetailsData: undefined, openedFromDeepLink: false };
    const isFocused = useIsFocused();
    const [details, setDetails] = useState<IWineDetails | null>(null);
    const [isError, setIsError] = useState(false);
    const [isAllVintagesSelected, setIsAllVintagesSelected] = useState(false);
    const [localIsSaved, setLocalIsSaved] = useState<boolean | undefined>(undefined);
    const [rateId, setRateId] = useState<number | null>(null);
    const isResettingRef = useRef(false);

    const getDetails = useCallback(async (params?: { vintages?: 'All' }) => {
        try {
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
    }, [rateId]);

    const onVintageChange = useCallback(async (item: IDropdownItem) => {
        const isNoneVintage = item.value === NONE_VINTAGE_DROPDOWN_VALUE;
        const isAllVintages = item.value === null
            || (typeof item.label === 'string' && item.label.toLowerCase() === localization.t('wine.allVintages').toLowerCase())
            || (typeof item.value === 'string' && item.value.toLowerCase() === 'all');

        if (isAllVintages) {
            setIsAllVintagesSelected(true);
            await getDetails({ vintages: 'All' });
            return;
        }

        setIsAllVintagesSelected(false);
        const selectedWineId = item.id ? Number(item.id) : null;
        const selectedVintage = isNoneVintage || item.value === null ? null : Number(item.value);

        if (selectedWineId && selectedWineId !== wineModel.selectedWineId) {
            wineModel.selectedWineId = selectedWineId;
            await getDetails();
            return;
        }

        if (selectedWineId && selectedWineId === wineModel.selectedWineId) {
            await getDetails();
            return;
        }

        if (selectedVintage !== null && Number.isNaN(selectedVintage)) {
            return;
        }

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
    }, [details, getDetails]);

    useEffect(() => {
        if (!isFocused) return;

        const frameId = requestAnimationFrame(() => {
            if (wineDetailsData) {
                setIsAllVintagesSelected(false);
                wineModel.selectedWineId = wineDetailsData.id;
                setDetails(wineDetailsData);
                wineModel.vintages = wineDetailsData.vintages;
                setLocalIsSaved(wineDetailsData.isSaved);
                setRateId(wineDetailsData.myReview?.id ?? null);
                setIsError(false);
                return;
            }

            if (!wineId) return;

            setIsAllVintagesSelected(false);
            wineModel.selectedWineId = wineId;
            getDetails();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [wineId, wineDetailsData, isFocused, getDetails]);

    const hasCurrentVintageData = !!details?.currentVintage && typeof details.currentVintage === 'object';

    const detailsWithLocalIsSaved = details ? {
        ...details,
        isSaved: localIsSaved ?? details.isSaved,
    } : null;

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
        isAllVintagesSelected,
        wineId,
        selectedWineId: wineModel.selectedWineId,
        fromScanner,
        onUpdateIsSaved,
        isPreloadedData: !!wineDetailsData,
        myReview: details?.myReview ?? null,
        onPressBack,
    };
};
