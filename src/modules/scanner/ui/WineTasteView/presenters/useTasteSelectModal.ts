import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { IWineTasteGroup } from '@/entities/wine/types/IWineTatseGroup';
import { useCallback, useState } from 'react';

export const useTasteSelectModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectData, setSelectData] = useState<IWineTaste[]>([]);
    const [groupId, setGroupId] = useState<number | null>(null);

    const onShowModal = useCallback((group: IWineTasteGroup) => {
        setSelectData(group.flavors);
        setGroupId(group.id);
        setIsVisible(true);
    }, []);

    const onHide = useCallback(() => {
        setIsVisible(false);
    }, []);

    return { isVisible, onShowModal, onHide, selectData, groupId };
};
