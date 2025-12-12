import { RefObject, useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { Typography } from '@/UIKit/Typography';
import { CustomInput } from '@/UIKit/CustomInput';
import { Button } from '@/UIKit/Button';
import { CrossIcon } from '@assets/icons/CrossIcon';

interface IProps {
    modalRef: RefObject<BottomSheetModal | null>;
    value: string;
    onChangeValue: (value: string) => void;
    onCreate: () => void;
    onClose: () => void;
}

export const CreateListBottomSheet = ({ modalRef, value, onChangeValue, onCreate, onClose }: IProps) => {
    const { colors, t } = useUiContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} onPress={onClose} />
        ),
        [onClose],
    );

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            enableDynamicSizing
            backdropComponent={renderBackdrop}
            handleComponent={null}
            backgroundStyle={styles.bottomSheetContainer}
            enablePanDownToClose
            onDismiss={onClose}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
        >
            <BottomSheetView style={styles.sheetContent}>
                <View style={styles.sheetHeader}>
                    <TouchableOpacity onPress={onClose} hitSlop={20}>
                        <CrossIcon />
                    </TouchableOpacity>
                    <Typography variant="h4" text={t('savedWine.createList')} style={styles.sheetTitle} />
                    <View style={styles.empty} />
                </View>
                <CustomInput
                    placeholder={t('savedWine.listName')}
                    value={value}
                    onChangeText={onChangeValue}
                    containerStyle={styles.inputContainer}
                />
                <Button text={t('common.create')} onPress={onCreate} />
            </BottomSheetView>
        </BottomSheetModal>
    );
};
