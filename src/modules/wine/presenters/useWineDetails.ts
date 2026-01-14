import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { localization } from '@/UIProvider/localization/Localization';
import { useRoute } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export const useWineDetails = () => {
    const { wineId } = (useRoute().params as { wineId: number }) || null;
    const [details, setDetails] = useState<IWineDetails | null>(null);
    const [isError, setIsError] = useState(false);
    const [id, setId] = useState<number | null>(wineId);

    const getDetails = useCallback(async () => {
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
                setDetails(response.data);
                setIsError(false);
            }
        } catch (error) {
            console.error('getTastes error: ', JSON.stringify(error, null, 2));
        }
    }, [id]);

    const onVintageChange = useCallback((item: IDropdownItem) => {
        if (item.id) {
            setId(Number(item.id));
        }
    }, []);

    return { details, isError, getDetails, id, onVintageChange };
};
