import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { favoriteWineListService } from '@/entities/wine/FavoriteWineListService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

export const useCreateListBottomSheet = () => {
    const [listName, setListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const createListModalRef = useRef<BottomSheetModal | null>(null);

    const onClose = useCallback(() => {
        createListModalRef.current?.dismiss();
        setListName('');
    }, []);

    const onOpen = useCallback(() => {
        setListName('');
        createListModalRef.current?.present();
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

    return { createListModalRef, listName, setListName, onClose, onOpen, onCreate, isCreating };
};
