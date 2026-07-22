import { useMemo } from 'react';
import { Image, View, ViewStyle } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IGalleryItem } from '../../types/IGalleryPhoto';
import { getStyles } from './styles';

interface IProps {
    item: IGalleryItem;
    containerStyle: ViewStyle;
}

export const GalleryViewerPhoto = ({ item, containerStyle }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={[styles.container, containerStyle]}>
            <Image source={{ uri: item.uri }} style={styles.image} resizeMode="contain" />
        </View>
    );
};
