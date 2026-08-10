import { faqService } from '@/entities/FAQ/FAQService';
import { IFAQListItem } from '@/entities/FAQ/types/IFAQListItem';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useEffect, useState } from 'react';

export const useFAQ = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<null | IFAQListItem[]>(null);

    const getFAQ = useCallback(async () => {
        setIsLoading(true);

        try {
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
        let isMounted = true;

        faqService.list().then((response) => {
            if (!isMounted) return;
            if (response.isError || !response.data) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
            } else {
                setData(response.data);
            }
            setIsLoading(false);
        }).catch((error) => {
            if (!isMounted) return;
            console.error(JSON.stringify(error, null, 4));
            setIsLoading(false);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, isLoading, getFAQ };
};
