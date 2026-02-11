import { useCallback, useMemo } from 'react';
import { ITasteProfile } from '@/entities/wine/types/ITasteProfile';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { useTasteProfile } from '@/modules/wineAndStyles/presenters/useTasteProfile';
import { useRefresh } from '@/hooks/useRefresh';

export const useMyTasteProfile = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isLoading, getData, tasteProfiles } = useTasteProfile();
    const { refreshControl } = useRefresh(getData);

    const keyExtractor = useCallback((item: ITasteProfile) => `${item.type.id}-${item.color.id}`, []);

    const getTitle = useCallback((item: ITasteProfile) => {
        return `${item.type.name} ${item.color.name}`;
    }, []);

    return {
        styles,
        isLoading,
        tasteProfiles,
        refreshControl,
        keyExtractor,
        getTitle,
    };
};
