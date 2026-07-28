import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useMemo } from 'react';
import { Typography } from '@/UIKit/Typography';
import { IFilterTagItem } from '@/modules/wineAndStyles/types/IFilterTagItem';
import { useFilterTag } from './presenters/useFilterTag';

interface IProps {
    tag: IFilterTagItem;
    onRemoveTag: (tag: IFilterTagItem) => void;
}

export const FilterTag = ({ tag, onRemoveTag }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onRemove } = useFilterTag(tag, onRemoveTag);

    return (
        <View style={styles.container}>
            <Typography variant="body_400" style={styles.label}>{tag.label}</Typography>
            <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
                <CrossIcon width={16} height={16} color={colors.background} />
            </TouchableOpacity>
        </View>
    );
};
