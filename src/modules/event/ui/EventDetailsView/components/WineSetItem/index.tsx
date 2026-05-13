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
    isBlindTasting?: boolean;
    wineOrder?: number;
    isOwner: boolean;
}

export const WineSetItem = ({ item, isBlindTasting = false, wineOrder = 1 }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { title, imageUrl, isImageVisible, onPress } = useWineSetItem({ item, isBlindTasting, wineOrder });

    return (
        <TouchableOpacity style={styles.row} onPress={onPress} disabled>
            <View style={styles.leftContent}>
                {isImageVisible && (
                    imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.image} />
                    )
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
