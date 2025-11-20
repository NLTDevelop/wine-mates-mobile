import { IAroma, ISmellSubgroup } from '@/entities/wine/types/IWineSmell';
import { useCallback, useState } from 'react';

export const useSelectModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectData, setSelectData] = useState<IAroma[]>([]);
    const [selectedSubgroup, setSelectedSubgroup] = useState<ISmellSubgroup | null>(null);
    const [groupId, setGroupId] = useState<number | null>(null);

    const onShowModal = useCallback((currentGroupId: number, subgroup: ISmellSubgroup) => {
        setSelectData(subgroup.aromas);
        setSelectedSubgroup(subgroup);
        setGroupId(currentGroupId);
        setIsVisible(true);
    }, []);

    const onHide = useCallback(() => {
        setIsVisible(false);
    }, []);

    return { isVisible, onShowModal, onHide, selectData, selectedSubgroup, groupId };
};
