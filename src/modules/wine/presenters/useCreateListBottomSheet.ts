import { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';
import { favoriteWineListService } from '@/entities/wine/FavoriteWineListService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

export const useCreateListBottomSheet = () => {
    const [listName, setListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const onClose = useCallback(() => {
        setIsVisible(false);
        setListName('');
    }, []);

    const onOpen = useCallback(() => {
        setListName('');
        setIsVisible(true);
    }, []);

    const onCreate = useCallback(async () => {
        if (!listName.trim() || isCreating) return;

        try {
            setIsCreating(true);
            Keyboard.dismiss();

            const response = await favoriteWineListService.create({ name: listName.trim() });

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                setIsCreating(false);
            } else {
                setIsCreating(false);
                onClose();
            }
        } catch (error) {
            console.error('onCreate error: ', JSON.stringify(error, null, 2));
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
            setIsCreating(false);
        }
    }, [listName, onClose, isCreating]);

    return { isVisible, listName, setListName, onClose, onOpen, onCreate, isCreating };
};
