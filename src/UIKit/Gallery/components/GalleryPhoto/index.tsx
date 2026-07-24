import { useMemo } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useUiContext } from '@/UIProvider';
import { IGalleryItem } from '../../types/IGalleryPhoto';
import { getStyles } from './styles';
import FastImage from '@d11/react-native-fast-image';

interface IProps extends IGalleryItem {
    photoStyle?: StyleProp<ViewStyle>;
}

export const GalleryPhoto = ({ uri, onPress, onDelete, photoStyle }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={[styles.button, photoStyle]} activeOpacity={0.85}>
                <FastImage source={{ uri }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
            {!!onDelete && (
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton} activeOpacity={0.85}>
                    <CrossIcon color={colors.text} width={12} height={12} />
                </TouchableOpacity>
            )}
        </View>
    );
};
