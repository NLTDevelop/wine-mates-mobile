import { RefObject, useCallback, useMemo } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { SearchBar } from '@/UIKit/SearchBar';
import { Typography } from '@/UIKit/Typography';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { IWineSearchResultViewItem } from '@/modules/event/types/IWineSetViewItem';
import { WineSearchResultRow } from '../WineSearchResultRow';
import { WineSearchEmptyState } from '../WineSearchEmptyState';
import { getStyles } from './styles';
import { useWineSearchBottomSheet } from './presenters/useWineSearchBottomSheet';

interface IProps {
    modalRef: RefObject<BottomSheetModal | null>;
    searchInputRef: RefObject<TextInput | null>;
    value: string;
    data: IWineSearchResultViewItem[];
    isLoading: boolean;
    emptyText: string;
    shouldShowScannerButton: boolean;
    onChangeText: (value: string) => void;
    onClose: () => void;
    onDismiss: () => void;
    onLoadMore: () => void;
    onOpenScannerPress: () => void;
}

export const WineSearchBottomSheet = ({
    modalRef,
    searchInputRef,
    value,
    data,
    isLoading,
    emptyText,
    shouldShowScannerButton,
    onChangeText,
    onClose,
    onDismiss,
    onLoadMore,
    onOpenScannerPress,
}: IProps) => {
    const { colors, t } = useUiContext();
    const { top } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { animatedListContainerStyle, snapPoints } = useWineSearchBottomSheet({
        modalRef,
    });

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
        return <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />;
    }, []);

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
                shouldShowScannerButton={shouldShowScannerButton}
                onOpenScannerPress={onOpenScannerPress}
            />
        );
    }, [emptyText, isLoading, onOpenScannerPress, shouldShowScannerButton]);

    return (
        <BottomSheetModal
            ref={modalRef}
            backgroundStyle={styles.bottomSheetContainer}
            handleComponent={null}
            enableDynamicSizing={false}
            snapPoints={snapPoints}
            topInset={top}
            enablePanDownToClose={false}
            onDismiss={onDismiss}
            backdropComponent={renderBackdrop}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            enableHandlePanningGesture={false}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerSpacer} />
                    <Typography variant="h4" text={t('event.addWine')} />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={20}>
                        <CrossIcon />
                    </TouchableOpacity>
                </View>

                <SearchBar
                    ref={searchInputRef}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={t('common.search')}
                    containerStyle={styles.searchContainer}
                />

                <Animated.View style={[styles.listContainer, animatedListContainerStyle]}>
                    <BottomSheetFlatList
                        data={data}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
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
        </BottomSheetModal>
    );
};
