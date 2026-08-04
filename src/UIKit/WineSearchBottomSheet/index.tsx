import { RefObject, useCallback, useMemo } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { SearchBar } from '@/UIKit/SearchBar';
import { Button } from '@/UIKit/Button';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { CameraIcon } from '@assets/icons/CameraIcon';
import { IWineSearchResultItem } from './types/IWineSearchResultItem';
import { WineSearchResultRow } from './components/WineSearchResultRow';
import { WineSearchEmptyState } from './components/WineSearchEmptyState';
import { useWineSearchBottomSheet } from './presenters/useWineSearchBottomSheet';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    title: string;
    scannerButtonText: string;
    searchInputRef: RefObject<TextInput | null>;
    value: string;
    data: IWineSearchResultItem[];
    isLoading: boolean;
    emptyText: string;
    onChangeText: (value: string) => void;
    onOpenScannerPress: () => void;
    onClose: () => void;
    onLoadMore: () => void;
}

export const WineSearchBottomSheet = ({
    visible,
    title,
    scannerButtonText,
    searchInputRef,
    value,
    data,
    isLoading,
    emptyText,
    onChangeText,
    onOpenScannerPress,
    onClose,
    onLoadMore,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { animatedListContainerStyle } = useWineSearchBottomSheet();

    const keyExtractor = useCallback((item: IWineSearchResultItem) => `${item.id}`, []);
    const renderItem = useCallback(({ item }: { item: IWineSearchResultItem }) => {
        return <WineSearchResultRow title={item.title} subtitle={item.subtitle} onPress={item.onPress} />;
    }, []);
    const renderItemSeparator = useCallback(() => <View style={styles.divider} />, [styles.divider]);
    const renderListEmpty = useCallback(() => {
        return <WineSearchEmptyState text={emptyText} isLoading={isLoading} />;
    }, [emptyText, isLoading]);

    return (
        <BottomModal
            visible={visible}
            onClose={onClose}
            title={title}
            isFullScreen
            shouldAvoidKeyboard={false}
        >
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
                    <Button
                        text={scannerButtonText}
                        onPress={onOpenScannerPress}
                        type="secondary"
                        containerStyle={styles.scanButton}
                        LeftAccessory={<CameraIcon color={colors.text} width={20} height={20} />}
                    />
                </Animated.View>
            </View>
        </BottomModal>
    );
};
