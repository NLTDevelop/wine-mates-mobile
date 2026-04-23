import { useMemo, ReactNode } from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useUiContext } from '@/UIProvider';
import { TitleVariant, Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useBottomModalState } from '@/UIKit/BottomModal/presenters/useBottomModalState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CrossIcon } from '@assets/icons/CrossIcon';

interface IProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    titleVariant?: TitleVariant;
    customHeader?: ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
    children: ReactNode;
}

export const BottomModal = ({
    visible,
    onClose,
    title,
    titleVariant = 'h4',
    customHeader,
    contentContainerStyle,
    children,
}: IProps) => {
    const { colors } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);
    const { modalRef, onRenderBackdrop, onRenderHandle, onDismiss, onClosePress } = useBottomModalState({
        visible,
        onClose,
    });

    return (
        <BottomSheetModal
            ref={modalRef}
            topInset={top}
            enablePanDownToClose
            enableDynamicSizing
            backdropComponent={onRenderBackdrop}
            handleComponent={onRenderHandle}
            onDismiss={onDismiss}
            backgroundStyle={styles.bottomSheetContainer}
        >
            <BottomSheetView style={styles.container}>
                {customHeader ? (
                    customHeader
                ) : (
                    <View style={styles.header}>
                        <View style={styles.closeButton} />
                        {title && (
                            <View style={styles.titleContainer} pointerEvents="none">
                                <Typography text={title} variant={titleVariant} style={styles.title} />
                            </View>
                        )}
                        <TouchableOpacity onPress={onClosePress} style={styles.closeButton} hitSlop={8}>
                            <CrossIcon />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={[styles.contentContainer, contentContainerStyle]}>{children}</View>
            </BottomSheetView>
        </BottomSheetModal>
    );
};
