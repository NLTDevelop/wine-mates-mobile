import { RefObject, useCallback, useMemo } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { SearchBar } from '@/UIKit/SearchBar';
import { IWineSearchResultViewItem } from '@/modules/event/types/IWineSetViewItem';
import { WineSearchResultRow } from '../WineSearchResultRow';
import { WineSearchEmptyState } from '../WineSearchEmptyState';
import { getStyles } from './styles';
import { useWineSearchBottomSheet } from './presenters/useWineSearchBottomSheet';
import { BottomModal } from '@/UIKit/BottomModal/ui';

interface IProps {
    visible: boolean;
    searchInputRef: RefObject<TextInput | null>;
    value: string;
    data: IWineSearchResultViewItem[];
    isLoading: boolean;
    emptyText: string;
    onChangeText: (value: string) => void;
    onClose: () => void;
    onLoadMore: () => void;
}

export const WineSearchBottomSheet = ({
    visible,
    searchInputRef,
    value,
    data,
    isLoading,
    emptyText,
    onChangeText,
    onClose,
    onLoadMore,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { animatedListContainerStyle } = useWineSearchBottomSheet();

    const keyExtractor = useCallback((item: IWineSearchResultViewItem) => {
        return `${item.id}`;
    }, []);

    const renderItem = useCallback(({ item }: { item: IWineSearchResultViewItem }) => {
        return <WineSearchResultRow title={item.title} subtitle={item.subtitle} onPress={item.onPress} />;
    }, []);

    const renderItemSeparator = useCallback(() => {
        return <View style={styles.divider} />;
    }, [styles.divider]);

    const renderListEmpty = useCallback(() => {
        return (
            <WineSearchEmptyState
                text={emptyText}
                isLoading={isLoading}
            />
        );
    }, [emptyText, isLoading]);

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('event.addWine')} isFullScreen shouldAvoidKeyboard={false}>
            <View style={styles.container}>
                <SearchBar
                    ref={searchInputRef}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={t('common.search')}
                    containerStyle={styles.searchContainer}
                />

                <Animated.View style={[styles.listContainer, animatedListContainerStyle]}>
                    <FlatList
                        data={data}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        style={styles.list}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.listContent}
                        ItemSeparatorComponent={renderItemSeparator}
                        ListEmptyComponent={renderListEmpty}
                        onEndReached={onLoadMore}
                        onEndReachedThreshold={0.4}
                        bounces={data.length > 0}
                        scrollEnabled={data.length > 0}
                    />
                </Animated.View>
            </View>
        </BottomModal>
    );
};
