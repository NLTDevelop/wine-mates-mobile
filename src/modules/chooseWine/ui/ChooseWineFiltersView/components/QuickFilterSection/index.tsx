import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IQuickFilterButtonItem } from '@/modules/chooseWine/types/IQuickFilterButtonItem';
import { getStyles } from './styles';

interface IProps {
    title: string;
    items: IQuickFilterButtonItem[];
}

export const QuickFilterSection = ({ title, items }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const keyExtractor = useCallback((item: IQuickFilterButtonItem) => {
        return item.id;
    }, []);

    const renderItem = useCallback<ListRenderItem<IQuickFilterButtonItem>>(({ item }) => {
        return (
            <TouchableOpacity
                onPress={item.onPress}
                style={[
                    styles.button,
                    item.isSelected ? styles.buttonActive : undefined,
                    item.isMore ? styles.moreButton : undefined,
                ]}
            >
                <Typography
                    variant={item.isMore ? 'subtitle_12_500' : 'subtitle_12_500'}
                    text={item.title}
                    style={[styles.buttonText, item.isMore ? styles.moreButtonText : undefined]}
                    numberOfLines={2}
                />
            </TouchableOpacity>
        );
    }, [styles]);

    if (items.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Typography variant="h6" text={title} style={styles.title} />
            <FlatList
                data={items}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={styles.row}
            />
        </View>
    );
};
