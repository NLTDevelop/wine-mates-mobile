import { useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { IAvailableWineryWine } from '@/entities/winery/types/IAvailableWineryWine';
import { useUiContext } from '@/UIProvider';
import { EmptyWine } from '@/UIKit/EmptyWine';
import { Typography } from '@/UIKit/Typography';
import { useAvailableWineryWineListItem } from './presenters/useAvailableWineryWineListItem';
import { getStyles } from './styles';

interface IProps {
    item: IAvailableWineryWine;
    onPress: (item: IAvailableWineryWine) => void;
}

export const AvailableWineryWineListItem = ({ item, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { imageUri, title, description, characteristics, location, onItemPress } = useAvailableWineryWineListItem({
        item,
        onPress,
    });

    return (
        <TouchableOpacity style={styles.container} onPress={onItemPress} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
                {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : <EmptyWine />}
            </View>
            <View style={styles.content}>
                <Typography variant="h5" text={title} numberOfLines={2} style={styles.title} />
                {!!description && <Typography variant="body_500" text={description} numberOfLines={2} />}
                {!!characteristics && (
                    <Typography
                        variant="subtitle_12_400"
                        text={characteristics}
                        numberOfLines={2}
                        style={styles.secondaryText}
                    />
                )}
                {!!location && (
                    <Typography
                        variant="subtitle_12_400"
                        text={location}
                        numberOfLines={2}
                        style={styles.secondaryText}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};
