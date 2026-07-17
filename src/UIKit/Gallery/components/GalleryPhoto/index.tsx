import { useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useUiContext } from '@/UIProvider';
import { IGalleryItem } from '../../types/IGalleryPhoto';
import { getStyles } from './styles';

interface IProps extends IGalleryItem {}

export const GalleryPhoto = ({ uri, onPress, onDelete }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.85}>
                <Image source={{ uri }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
            {!!onDelete && (
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton} activeOpacity={0.85}>
                    <CrossIcon color={colors.text} width={12} height={12} />
                </TouchableOpacity>
            )}
        </View>
    );
};
