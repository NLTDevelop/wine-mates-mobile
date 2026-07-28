import { useCallback, useState } from 'react';
import { InteractionManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { userService } from '@/entities/users/UserService';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';

export const useSellerCountriesField = () => {
    const [sellerCountriesText, setSellerCountriesText] = useState('');

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(async () => {
                const response = await userService.getSellerCountries();

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }

                setSellerCountriesText(
                    response.data
                        .map(item => item.country?.name?.trim())
                        .filter(Boolean)
                        .join(', '),
                );
            });

            return () => {
                task.cancel();
            };
        }, []),
    );

    return { sellerCountriesText };
};
