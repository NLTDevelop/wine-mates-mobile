import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { localization } from '@/UIProvider/localization/Localization';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useWineDetails = () => {
    const { wineId } = (useRoute().params as { wineId: number }) || null;
    const [details, setDetails] = useState<IWineDetails | null>(null);
    const [isError, setIsError] = useState(false);
    const [id, setId] = useState<number | null>(wineId);
    const previousWineIdRef = useRef<number | null>(wineId);
    const isManualChangeRef = useRef(false);

    const getDetails = useCallback(async (preserveImage: boolean = false) => {
        try {
            if (!id) return;

            const response = await wineService.getById(id);

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                setIsError(true);
            } else {
                setDetails(prev => {
                    if (preserveImage && prev?.image) {
                        return {
                            ...response.data,
                            image: prev.image
                        };
                    }
                    return response.data;
                });
                setIsError(false);
            }
        } catch (error) {
            console.error('getTastes error: ', JSON.stringify(error, null, 2));
        }
    }, [id]);

    const onVintageChange = useCallback(async (item: IDropdownItem) => {
        isManualChangeRef.current = true;
        
        if (item.id) {
            const newId = Number(item.id);
            setId(newId);
            
            try {
                const response = await wineService.getById(newId);
                if (!response.isError && response.data) {
                    setDetails(prev => ({
                        ...response.data,
                        image: prev?.image || response.data.image
                    }));
                }
            } catch (error) {
                console.error('Error loading vintage:', error);
            }
        } else if (details) {
            const newVintageValue = item.value === null ? null : Number(item.value);

            setDetails({
                ...details,
                vintage: newVintageValue,
                currentVintage: null,
                isTasted: false,
            });
        }
        
        setTimeout(() => {
            isManualChangeRef.current = false;
        }, 100);
    }, [details]);

    useEffect(() => {
        if (wineId && wineId !== id && !isManualChangeRef.current) {
            setId(wineId);
        }
    }, [wineId, id]);

    useEffect(() => {
        if (!isManualChangeRef.current) {
            getDetails();
        }
    }, [getDetails]);

    useFocusEffect(
        useCallback(() => {
            if (wineId && wineId !== previousWineIdRef.current) {
                previousWineIdRef.current = wineId;
                isManualChangeRef.current = false;
                setId(wineId);
            } else if (id && !isManualChangeRef.current) {
                getDetails();
            }
        }, [wineId, id, getDetails])
    );

    const isVintageInList = details?.vintages.some(v => v.vintage === details.vintage) ?? false;
    const hasCurrentVintageData = details?.currentVintage !== null;

    return { details, isError, getDetails, id, onVintageChange, isVintageInList, hasCurrentVintageData };
};
