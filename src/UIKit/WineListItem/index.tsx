import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { getStyles } from './styles';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { StarIcon } from '@assets/icons/StartIcon';
import { declOfWord } from '@/utils';
import { Avatar } from '@/UIKit/Avatar';
import { useSelectablePressGuard } from '@/hooks/useSelectablePressGuard';

interface IProps {
    item: IWineListItem;
    onPress: (item: IWineListItem) => void;
}

export const WineListItem = ({ item, onPress }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const guard = useSelectablePressGuard();
    const handleItemPress = useCallback(() => guard.bindPressable.onPress(() => onPress(item)), [item, onPress, guard]);

    return (
        <Pressable
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
            onPress={handleItemPress}
            onPressOut={guard.bindPressable.onPressOut}
        >
            <View pointerEvents="none">
                {item.image?.originalUrl && (
                    <FasterImageView
                        source={{ uri: item.image?.originalUrl, resizeMode: 'cover' }}
                        style={styles.image}
                        radius={12}
                    />
                )}
            </View>
            <View style={styles.mainContainer}>
                <View style={styles.subContainer}>
                    <Typography
                        variant="h6"
                        text={`${item.name} ${item.vintage}`}
                        numberOfLines={2}
                        style={styles.title}
                        {...guard.bindText}
                    />
                    <View style={styles.rateContainer}>
                        <StarIcon />
                        <Typography variant="subtitle_12_500" text={item.review_average || '-'} />
                        <Typography
                            variant="subtitle_12_400"
                            text={`(${declOfWord(
                                item.review_count || 0,
                                t('scanner.reviewCount') as unknown as Array<string>,
                            )})`}
                            style={styles.text}
                        />
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <View style={styles.userRow}>
                        <Avatar
                            avatarUrl={item?.user?.image_url || null}
                            fullname={`${item?.user?.firstName} ${item?.user?.lastName}`}
                            size={24}
                        />
                        <Typography
                            text={`${item?.user?.firstName} ${item?.user?.lastName}`}
                            numberOfLines={1}
                            style={styles.title}
                            {...guard.bindText}
                        />
                    </View>
                    <Typography
                        variant="body_400"
                        text={item.description ?? '-'}
                        numberOfLines={3}
                        style={styles.text}
                    />
                </View>
            </View>
        </Pressable>
    );
};
