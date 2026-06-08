import { useCallback, useMemo } from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity, View } from 'react-native';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { Checkbox } from '@/UIKit/Checkbox';
import { useBottomModalState } from '@/UIKit/BottomModal/presenters/useBottomModalState';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { IUniversalPickerOption } from './types/IUniversalPickerOption';

const windowHeight = Dimensions.get('window').height;

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

export const UniversalPickerModal = ({
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
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [bottom, colors]);
    const snapPoints = useMemo(() => [windowHeight], []);
    const { modalRef, onRenderBackdrop, onRenderHandle, onDismiss, onClosePress } = useBottomModalState({
        visible,
        onClose,
    });

    const keyExtractor = useCallback((item: IUniversalPickerOption) => {
        return item.id;
    }, []);

    const renderItem = useCallback(({ item }: { item: IUniversalPickerOption }) => {
        return (
            <TouchableOpacity onPress={item.onPress} style={styles.option}>
                <View style={styles.optionTextContainer}>
                    <Typography variant="h6" text={item.title} style={styles.optionText} />
                    {item.subtitle ? (
                        <Typography variant="subtitle_12_400" text={item.subtitle} style={styles.optionSubtitle} />
                    ) : null}
                </View>
                <Checkbox isChecked={item.isSelected} onPress={item.onPress} isRound={selectionMode === 'single'} />
            </TouchableOpacity>
        );
    }, [selectionMode, styles]);

    const renderSeparator = useCallback(() => {
        return <View style={styles.separator} />;
    }, [styles]);

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            topInset={top}
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            enableOverDrag={false}
            backdropComponent={onRenderBackdrop}
            handleComponent={onRenderHandle}
            onDismiss={onDismiss}
            backgroundStyle={styles.bottomSheetContainer}
        >
            <View style={styles.header}>
                <View style={styles.closeButton} />
                <View style={styles.titleContainer} pointerEvents="none">
                    <Typography text={title} variant="h4" style={styles.title} />
                </View>
                <TouchableOpacity onPress={onClosePress} style={styles.closeButton} hitSlop={8}>
                    <CrossIcon />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.stateContainer}>
                        <ActivityIndicator color={colors.primary} />
                    </View>
                ) : (
                    <BottomSheetFlatList
                        data={options}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        ItemSeparatorComponent={renderSeparator}
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        nestedScrollEnabled
                        bounces={false}
                        overScrollMode="never"
                        ListEmptyComponent={
                            <View style={styles.stateContainer}>
                                <Typography variant="h5" text={emptyText} style={styles.emptyText} />
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
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
        </BottomSheetModal>
    );
};
