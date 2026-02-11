import { useCallback, useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { userModel } from '@/entities/users/UserModel';
import { TasteProfileSectionType } from '../../types/TasteProfileSectionType';
import { ITasteProfileCharacteristic } from '@/entities/wine/types/ITasteProfile';

export const useTastesList = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const isPremiumUser = userModel.user?.hasPremium || false;

    const title = useMemo(() => {
        return t(`wineAndStyles.${TasteProfileSectionType.TASTES}` as any);
    }, [t]);

    const mapCharacteristicToItem = useCallback((char: ITasteProfileCharacteristic) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            colorHex: char.colorHex,
            isPremium: char.isPremium,
            isTriple: true,
            levels: char.levels,
            selectedIndex: char.avgValue ?? undefined,
        };
    }, []);

    return {
        styles,
        isPremiumUser,
        title,
        mapCharacteristicToItem,
    };
};
