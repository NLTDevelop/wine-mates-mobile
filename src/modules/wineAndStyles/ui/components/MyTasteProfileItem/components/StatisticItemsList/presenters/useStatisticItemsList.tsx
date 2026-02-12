import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { TasteProfileSectionType } from '../../../types/TasteProfileSectionType';

interface IUseStatisticItemsListProps {
    sectionType: TasteProfileSectionType;
}

export const useStatisticItemsList = ({ sectionType }: IUseStatisticItemsListProps) => {
    const { t } = useUiContext();

    const title = useMemo(() => {
        return t(`wineAndStyles.${sectionType}` as any);
    }, [sectionType, t]);

    return {
        title,
    };
};
