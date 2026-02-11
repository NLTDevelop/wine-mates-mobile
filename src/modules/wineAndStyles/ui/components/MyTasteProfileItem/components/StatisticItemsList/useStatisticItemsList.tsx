import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { TasteProfileSectionType } from '../../types/TasteProfileSectionType';

interface IUseStatisticItemsListProps {
    sectionType: TasteProfileSectionType;
}

export const useStatisticItemsList = ({ sectionType }: IUseStatisticItemsListProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const title = useMemo(() => {
        return t(`wineAndStyles.${sectionType}` as any);
    }, [sectionType, t]);

    return {
        styles,
        title,
    };
};
