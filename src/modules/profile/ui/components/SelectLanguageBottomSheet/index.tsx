import { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetBackdropProps, WINDOW_HEIGHT,
    BottomSheetView } from '@gorhom/bottom-sheet';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TickIcon } from '@assets/icons/TickIcon';

interface IProps {
    modalRef: React.RefObject<BottomSheetModal | null>;
    onItemPress: (item: string) => void;
    onClose: () => void;
}

export const SelectLanguageBottomSheet = ({ modalRef, onItemPress, onClose }: IProps) => {
    const { colors, t, locales, locale } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom, top), [colors, bottom, top]);

    const keyExtractor = useCallback((item: string) => `${item}`, []);
    const renderItem = useCallback(({ item }: { item: string }) => {
        const isSelected = locale === item;
        return (
            <TouchableOpacity onPress={() => onItemPress(item)} style={styles.item}>
                <Typography
                    variant="h5"
                    text={t(`locale.${item}`)}
                    style={isSelected ? styles.selectedText : undefined}
                />
                {isSelected && <TickIcon width={24} height={24} color={colors.icon_primary} />}
            </TouchableOpacity>
        );
    }, [onItemPress, styles, colors, t, locale]);

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ), []);

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
                    <TouchableOpacity onPress={onClose} hitSlop={20}>
                        <CrossIcon />
                    </TouchableOpacity>
                    <Typography variant="h4" text={t('settings.language')} />
                    <View style={styles.headerSpacer} />
                </View>
                <FlatList
                    data={locales}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                />
            </BottomSheetView>
        </BottomSheetModal>
    );
};
