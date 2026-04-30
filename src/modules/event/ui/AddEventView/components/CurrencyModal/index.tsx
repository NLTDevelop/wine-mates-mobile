import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { SearchBar } from '@/UIKit/SearchBar';
import { ICurrencyOption } from '@/modules/event/types/ICurrencyOption';
import { useBottomModalState } from '@/UIKit/BottomModal/presenters/useBottomModalState';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { useCurrencyModal } from './presenters/useCurrencyModal';

const SNAP_POINTS = ['90%'];

interface IProps {
    visible: boolean;
    onClose: () => void;
    items: ICurrencyOption[];
    selectedValue: string;
    onConfirm: () => void;
}

export const CurrencyModal = ({ visible, onClose, items, selectedValue, onConfirm }: IProps) => {
    const { colors, t } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [bottom, colors]);
    const { search, filteredItems, onChangeSearch } = useCurrencyModal({ items });
    const { modalRef, onRenderBackdrop, onRenderHandle, onDismiss, onClosePress } = useBottomModalState({
        visible,
        onClose,
    });

    const keyExtractor = useCallback((item: ICurrencyOption) => {
        return item.value;
    }, []);

    const renderItem = useCallback(({ item }: { item: ICurrencyOption }) => {
        return (
            <TouchableOpacity
                onPress={item.onPress}
                style={[styles.option, selectedValue === item.value && styles.selectedOption]}
            >
                <Typography
                    variant="h6"
                    text={item.label}
                    style={[styles.optionText, selectedValue === item.value && styles.selectedOptionText]}
                />
            </TouchableOpacity>
        );
    }, [selectedValue, styles]);

    const renderSeparator = useCallback(() => {
        return <View style={styles.separator} />;
    }, [styles]);

    const listEmptyComponent = useMemo(() => {
        return (
            <View style={styles.emptyContainer}>
                <Typography variant="body_400" text={t('common.nothingFoundTitle')} style={styles.emptyText} />
            </View>
        );
    }, [styles, t]);

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={SNAP_POINTS}
            enableDynamicSizing={false}
            topInset={top}
            enablePanDownToClose
            backdropComponent={onRenderBackdrop}
            handleComponent={onRenderHandle}
            onDismiss={onDismiss}
            backgroundStyle={styles.bottomSheetContainer}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
        >
            <View style={styles.header}>
                <View style={styles.closeButton} />
                <View style={styles.titleContainer} pointerEvents="none">
                    <Typography text={t('event.currency')} variant="h4" style={styles.title} />
                </View>
                <TouchableOpacity onPress={onClosePress} style={styles.closeButton} hitSlop={8}>
                    <CrossIcon />
                </TouchableOpacity>
            </View>
            <SearchBar
                value={search}
                onChangeText={onChangeSearch}
                placeholder={t('common.search')}
                containerStyle={styles.searchContainer}
            />
            <BottomSheetFlatList
                data={filteredItems}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ItemSeparatorComponent={renderSeparator}
                ListEmptyComponent={listEmptyComponent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                initialNumToRender={30}
                windowSize={30}
                maxToRenderPerBatch={60}
                removeClippedSubviews
            />
            <View style={styles.footer}>
                <Button
                    text={t('common.confirm')}
                    onPress={onConfirm}
                    type="main"
                    containerStyle={styles.confirmButton}
                />
            </View>
        </BottomSheetModal>
    );
};
