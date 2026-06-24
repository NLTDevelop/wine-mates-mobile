import { memo, useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { SearchBar } from '@/UIKit/SearchBar';
import { getStyles } from './styles';
import { ICurrencyOption } from '../types/ICurrencyOption';
import { useCurrencyPickerSearch } from '../presenters/useCurrencyPickerSearch';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { useCurrencyPickerKeyboardInset } from '../presenters/useCurrencyPickerKeyboardInset';

interface IProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    items: ICurrencyOption[];
    selectedValue: string;
    onConfirm: () => void;
}

const CurrencyPickerBottomSheetComponent = ({ visible, title, onClose, items, selectedValue, onConfirm }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { search, filteredItems, onChangeSearch } = useCurrencyPickerSearch({ items });
    const { keyboardSpacerStyle } = useCurrencyPickerKeyboardInset();

    const keyExtractor = useCallback((item: ICurrencyOption) => {
        return item.value;
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: ICurrencyOption }) => {
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
        },
        [selectedValue, styles],
    );

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
        <BottomModal visible={visible} onClose={onClose} title={title} isFullScreen shouldAvoidKeyboard={false}>
            <View style={styles.container}>
                <SearchBar
                    value={search}
                    onChangeText={onChangeSearch}
                    placeholder={t('common.search')}
                    containerStyle={styles.searchContainer}
                />
                <FlatList
                    data={filteredItems}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    style={styles.list}
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
                <Reanimated.View style={keyboardSpacerStyle} />
            </View>
        </BottomModal>
    );
};

export const CurrencyPickerBottomSheet = memo(CurrencyPickerBottomSheetComponent);
