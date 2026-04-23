import { useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { getStyles } from './styles';
import { useWineSetItem } from './presenters/useWineSetItem';
import { IWineSetItem } from '@/entities/events/types/IWineSetItem';

interface IProps {
    item: IWineSetItem;
}

export const WineSetItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { title, imageUrl, onPress } = useWineSetItem({ item });

    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            <View style={styles.leftContent}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <View style={styles.image} />
                )}
                <Typography
                    text={title}
                    variant="body_400"
                    style={styles.title}
                />
            </View>
            <ArrowDownIcon rotate={270} color={colors.text_light} width={20} height={20} />
        </TouchableOpacity>
    );
};
