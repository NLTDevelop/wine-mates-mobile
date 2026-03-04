import { faqService } from '@/entities/FAQ/FAQService';
import { IFAQListItem } from '@/entities/FAQ/types/IFAQListItem';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useEffect, useState } from 'react';

export const useFAQ = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<null | IFAQListItem[]>(null);

    const getFAQ = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await faqService.list();

            if (response.isError || !response.data) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
            } else {
                setData(response.data);
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getFAQ();
    }, [getFAQ]);

    return { data, isLoading, getFAQ };
};
