import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { Checkbox } from '@/UIKit/Checkbox';
import { getStyles } from './styles';
import { useUniversalPickerBottomModal } from './presenters/useUniversalPickerBottomModal';
import { IUniversalPickerOption } from './types/IUniversalPickerOption';

interface IProps {
    visible: boolean;
    title: string;
    options: IUniversalPickerOption[];
    isLoading: boolean;
    isConfirming?: boolean;
    selectionMode: 'single' | 'multiple';
    emptyText: string;
    confirmText: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const UniversalPickerBottomModal = ({
    visible,
    title,
    options,
    isLoading,
    isConfirming = false,
    selectionMode,
    emptyText,
    confirmText,
    onClose,
    onConfirm,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { isFullScreen, regularListHeight, isRegularListScrollEnabled } = useUniversalPickerBottomModal({
        options,
        isLoading,
    });

    const keyExtractor = useCallback((item: IUniversalPickerOption) => {
        return item.id;
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: IUniversalPickerOption }) => {
            return (
                <TouchableOpacity onPress={item.onPress} style={styles.option} activeOpacity={0.7}>
                    <View style={styles.optionTextContainer}>
                        <Typography variant="h6" text={item.title} style={styles.optionText} />

                        {item.subtitle ? (
                            <Typography variant="subtitle_12_400" text={item.subtitle} style={styles.optionSubtitle} />
                        ) : null}
                    </View>

                    <Checkbox isChecked={item.isSelected} onPress={item.onPress} isRound={selectionMode === 'single'} />
                </TouchableOpacity>
            );
        },
        [selectionMode, styles],
    );

    const renderSeparator = useCallback(() => {
        return <View style={styles.separator} />;
    }, [styles]);

    const renderEmpty = useCallback(() => {
        return (
            <View style={styles.emptyContainer}>
                <Typography variant="h5" text={emptyText} style={styles.emptyText} />
            </View>
        );
    }, [emptyText, styles]);

    if (isFullScreen) {
        return (
            <BottomModal visible={visible} onClose={onClose} title={title} isFullScreen>
                <View style={styles.fullScreenContainer}>
                    {isLoading ? (
                        <View style={styles.fullScreenStateContainer}>
                            <ActivityIndicator color={colors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={options}
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                            ItemSeparatorComponent={renderSeparator}
                            style={styles.fullScreenList}
                            contentContainerStyle={[
                                styles.fullScreenListContentContainer,
                                options.length === 0 && styles.fullScreenEmptyListContentContainer,
                            ]}
                            nestedScrollEnabled
                            bounces={false}
                            overScrollMode="never"
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={renderEmpty}
                        />
                    )}

                    <View style={styles.footer}>
                        <Button
                            text={confirmText}
                            onPress={onConfirm}
                            type="main"
                            disabled={isLoading || isConfirming}
                            inProgress={isConfirming}
                            containerStyle={styles.confirmButton}
                        />
                    </View>
                </View>
            </BottomModal>
        );
    }

    return (
        <BottomModal visible={visible} onClose={onClose} title={title}>
            {isLoading ? (
                <View style={styles.regularStateContainer}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={options}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    ItemSeparatorComponent={renderSeparator}
                    style={[styles.regularList, { maxHeight: regularListHeight }]}
                    contentContainerStyle={[
                        styles.regularListContentContainer,
                        options.length === 0 && styles.regularEmptyListContentContainer,
                    ]}
                    nestedScrollEnabled={isRegularListScrollEnabled}
                    scrollEnabled={isRegularListScrollEnabled}
                    bounces={false}
                    overScrollMode="never"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmpty}
                />
            )}
            <View style={styles.footer}>
                <Button
                    text={confirmText}
                    onPress={onConfirm}
                    type="main"
                    disabled={isLoading || isConfirming}
                    inProgress={isConfirming}
                    containerStyle={styles.confirmButton}
                />
            </View>
        </BottomModal>
    );
};
