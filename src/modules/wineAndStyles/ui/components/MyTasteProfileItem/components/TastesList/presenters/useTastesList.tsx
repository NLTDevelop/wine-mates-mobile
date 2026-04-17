import { useCallback, useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { userModel } from '@/entities/users/UserModel';
import { TasteProfileSectionEnum } from '../../../enums/TasteProfileSectionEnum';
import { ITasteProfileCharacteristic } from '@/entities/wine/types/ITasteProfile';

export const useTastesList = () => {
    const { t } = useUiContext();
    const isPremiumUser = userModel.user?.hasPremium || false;

    const title = useMemo(() => {
        return t(`wineAndStyles.${TasteProfileSectionEnum.TASTES}` as any);
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
        isPremiumUser,
        title,
        mapCharacteristicToItem,
    };
};
