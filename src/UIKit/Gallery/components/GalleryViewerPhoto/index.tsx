import { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IGalleryItem } from '../../types/IGalleryPhoto';
import { getStyles } from './styles';
import FastImage from '@d11/react-native-fast-image';

interface IProps {
    item: IGalleryItem;
    containerStyle: ViewStyle;
}

export const GalleryViewerPhoto = ({ item, containerStyle }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={[styles.container, containerStyle]}>
            <FastImage source={{ uri: item.uri }} style={styles.image} resizeMode="contain" />
        </View>
    );
};
