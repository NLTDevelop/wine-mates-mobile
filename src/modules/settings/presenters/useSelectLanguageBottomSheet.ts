import { useCallback, useState } from 'react';
import { useUiContext } from '@/UIProvider';
import { userService } from '@/entities/users/UserService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

export const useSelectLanguageBottomSheet = () => {
    const { locale, setLocale } = useUiContext();
    const [isVisible, setIsVisible] = useState(false);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onOpen = useCallback(() => {
        setIsVisible(true);
    }, []);

    const onItemPress = useCallback(async (item: string) => {
        if (item === locale) {
            setIsVisible(false);
            return;
        }

        setLocale(item);
        setIsVisible(false);
        try {
            const response = await userService.updateLanguage(item);

            if (response.isError) {
                setLocale(locale);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            }
        } catch {
            setLocale(locale);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        }
    }, [locale, setLocale]);

    return { isVisible, onItemPress, onClose, onOpen };
};
