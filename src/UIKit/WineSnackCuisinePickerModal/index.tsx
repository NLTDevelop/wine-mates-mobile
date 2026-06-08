import { useCallback, useMemo } from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity, View } from 'react-native';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { Checkbox } from '@/UIKit/Checkbox';
import { IWineSnackCuisineOption } from '@/entities/snacks/types/IWineSnackCuisineOption';
import { getStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomModalState } from '@/UIKit/BottomModal/presenters/useBottomModalState';
import { CrossIcon } from '@assets/icons/CrossIcon';

const windowHeight = Dimensions.get('window').height;

interface IProps {
    visible: boolean;
    options: IWineSnackCuisineOption[];
    isLoading: boolean;
    isConfirming: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const WineSnackCuisinePickerModal = ({
    visible,
    options,
    isLoading,
    isConfirming,
    onClose,
    onConfirm,
}: IProps) => {
    const { colors, t } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [bottom, colors]);
    const snapPoints = useMemo(() => [windowHeight], []);
    const { modalRef, onRenderBackdrop, onRenderHandle, onDismiss, onClosePress } = useBottomModalState({
        visible,
        onClose,
    });

    const keyExtractor = useCallback((item: IWineSnackCuisineOption) => {
        return `${item.id}`;
    }, []);

    const renderItem = useCallback(({ item }: { item: IWineSnackCuisineOption }) => {
        return (
            <TouchableOpacity onPress={item.onPress} style={styles.option}>
                <Typography variant="h6" text={item.name} style={styles.optionText} />
                <Checkbox isChecked={item.isSelected} onPress={item.onPress} isRound />
            </TouchableOpacity>
        );
    }, [styles]);

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
                    <Typography text={t('wine.snackCuisines')} variant="h4" style={styles.title} />
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
                                <Typography
                                    variant="h5"
                                    text={t('wine.noSnackCuisines')}
                                    style={styles.emptyText}
                                />
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
            <View style={styles.footer}>
                <Button
                    text={t('common.confirm')}
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
