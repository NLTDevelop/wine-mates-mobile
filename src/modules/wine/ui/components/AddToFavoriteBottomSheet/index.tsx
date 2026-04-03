import { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetBackdropProps, WINDOW_HEIGHT,
    BottomSheetView } from '@gorhom/bottom-sheet';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IFavoriteItem } from '@/modules/wine/presenters/useAddToFavoriteBottomSheet';
import { Checkbox } from '@/UIKit/Checkbox';
import { Button } from '@/UIKit/Button';

interface IProps {
    modalRef: React.RefObject<BottomSheetModal | null>;
    onItemPress: (item: IFavoriteItem) => void;
    onClose: () => void;
    data: IFavoriteItem[];
    onSave: () => void;
    isLoading?: boolean;
    isSaving?: boolean;
}

export const AddToFavoriteBottomSheet = ({ modalRef, onItemPress, onClose, data, onSave, isLoading, isSaving }: IProps) => {
    const { colors, t } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom, top), [colors, bottom, top]);
    const buttonDisabled = useMemo(() => data.filter(item => item.isSelected).length === 0, [data]);

    const keyExtractor = useCallback((item: IFavoriteItem) => `${item.id}`, []);

    const renderItem = useCallback(({ item }: { item: IFavoriteItem }) => (
        <TouchableOpacity onPress={() => onItemPress(item)} style={styles.item}>
            <Typography variant="h6" text={item.title} />
            <Checkbox isChecked={item.isSelected} onPress={() => onItemPress(item)} />
        </TouchableOpacity>
    ), [onItemPress, styles]);

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ), []);

    const renderSeparator = useCallback(() => <View style={styles.itemSeparator} />, [styles]);

    return (
        <BottomSheetModal
            ref={modalRef}
            topInset={top}
            enablePanDownToClose
            enableDynamicSizing
            maxDynamicContentSize={WINDOW_HEIGHT}
            handleComponent={() => null}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetContainer}
            onDismiss={onClose}
        >
            <BottomSheetView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerSpacer} />
                    <Typography variant="h4" text={t('common.save')} />
                    <TouchableOpacity onPress={onClose} hitSlop={20}>
                        <CrossIcon />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={data}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    ItemSeparatorComponent={renderSeparator}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                />
                <Button
                    type='main'
                    onPress={onSave}
                    text={t('common.choose')}
                    disabled={buttonDisabled || isSaving || isLoading}
                />
            </BottomSheetView>
        </BottomSheetModal>
    );
};
