import { favoriteWineListService } from '@/entities/wine/FavoriteWineListService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useCallback, useState } from 'react';

export const useDeleteFavoriteList = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [selectedList, setSelectedList] = useState<{ id: number; name: string } | null>(null);

    const onDeleteList = useCallback((listId: number, listName: string) => {
        setSelectedList({ id: listId, name: listName });
        setIsAlertVisible(true);
    }, []);

    const onCloseAlert = useCallback(() => {
        setIsAlertVisible(false);
        setSelectedList(null);
    }, []);

    const onConfirmDelete = useCallback(async () => {
        if (!selectedList) return;

        try {
            setIsDeleting(true);
            const response = await favoriteWineListService.delete(selectedList.id);

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
            } else {
                onCloseAlert();
            }
        } catch (error) {
            console.error('onConfirmDelete error: ', JSON.stringify(error, null, 2));
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        } finally {
            setIsDeleting(false);
        }
    }, [selectedList, onCloseAlert]);

    return {
        onDeleteList,
        isDeleting,
        isAlertVisible,
        selectedList,
        onCloseAlert,
        onConfirmDelete,
    };
};
