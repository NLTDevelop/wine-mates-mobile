import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFavoriteWineLists } from './useFavoriteWineLists';
import { favoriteWineService } from '@/entities/wine/FavoriteWineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

export interface IFavoriteItem {
    id: number;
    title: string;
    isSelected: boolean;
}

export const useAddToFavoriteBottomSheet = (wineId?: number, onUpdateIsSaved?: (isSaved: boolean) => void) => {
    const addToFavoriteModalRef = useRef<BottomSheetModal | null>(null);
    const { lists, isLoading: isLoadingLists, loadLists } = useFavoriteWineLists();
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [initialSelectedIds, setInitialSelectedIds] = useState<Set<number>>(new Set());
    const [isCheckingLists, setIsCheckingLists] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const checkWineInLists = useCallback(async () => {
        if (!lists || !wineId) return;

        try {
            setIsCheckingLists(true);
            const listsWithWine = new Set<number>();

            await Promise.all(
                lists.map(async list => {
                    const response = await favoriteWineService.getWinesByListId(list.id, {
                        offset: 0,
                        limit: 100,
                    });

                    if (!response.isError && response.data?.rows) {
                        const hasWine = response.data.rows.some(wine => wine.id === wineId);
                        if (hasWine) {
                            listsWithWine.add(list.id);
                        }
                    }
                }),
            );

            setSelectedIds(listsWithWine);
            setInitialSelectedIds(listsWithWine);
        } catch (error) {
            console.error('checkWineInLists error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsCheckingLists(false);
        }
    }, [lists, wineId]);

    const onClose = useCallback(() => {
        addToFavoriteModalRef.current?.dismiss();
    }, []);

    const onOpen = useCallback(async () => {
        addToFavoriteModalRef.current?.present();
        if (!lists) {
            await loadLists();
        }
        if (wineId) {
            await checkWineInLists();
        }
    }, [lists, loadLists, wineId, checkWineInLists]);

    const onItemPress = useCallback((item: IFavoriteItem) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(item.id)) {
                newSet.delete(item.id);
            } else {
                newSet.add(item.id);
            }
            return newSet;
        });
    }, []);

    const onSave = useCallback(async () => {
        if (!wineId) {
            onClose();
            return;
        }

        try {
            setIsSaving(true);

            const listsToAdd = Array.from(selectedIds).filter(id => !initialSelectedIds.has(id));
            const listsToRemove = Array.from(initialSelectedIds).filter(id => !selectedIds.has(id));

            const addPromises = listsToAdd.map(listId =>
                favoriteWineService.addWineToList(listId, { wineId }),
            );

            const removePromises = listsToRemove.map(listId =>
                favoriteWineService.removeWineFromList(listId, wineId),
            );

            await Promise.all([...addPromises, ...removePromises]);

            if (onUpdateIsSaved) {
                onUpdateIsSaved(selectedIds.size > 0);
            }

            onClose();
        } catch (error) {
            console.error('onSave error: ', JSON.stringify(error, null, 2));
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        } finally {
            setIsSaving(false);
        }
    }, [wineId, selectedIds, initialSelectedIds, onClose]);

    const favoriteData = useMemo(() => {
        if (!lists) return [];
        return lists.map(list => ({
            id: list.id,
            title: list.name,
            isSelected: selectedIds.has(list.id),
        }));
    }, [lists, selectedIds]);

    const isLoading = isLoadingLists || isCheckingLists;

    return { favoriteData, addToFavoriteModalRef, onItemPress, onClose, onOpen, onSave, isLoading, isSaving };
};
