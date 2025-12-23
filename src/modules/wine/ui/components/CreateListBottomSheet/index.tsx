import { useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetInput } from '@/UIKit/BottomSheetInput';

interface IProps {
    modalRef: React.RefObject<BottomSheetModal | null>;
    value: string;
    onChangeValue: (v: string) => void;
    onCreate: () => void;
    onClose: () => void;
}

export const CreateListBottomSheet = ({ modalRef, value, onChangeValue, onCreate, onClose }: IProps) => {
    const { colors, t } = useUiContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
        ),
        [],
    );

    return (
        <BottomSheetModal
            ref={modalRef}
            enablePanDownToClose
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            handleComponent={() => null}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetContainer}
            onDismiss={onClose}
        >
            <BottomSheetView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerSpacer} />
                    <Typography variant="h4" text={t('savedWine.createList')} />
                    <TouchableOpacity onPress={onClose} hitSlop={20}>
                        <CrossIcon />
                    </TouchableOpacity>
                </View>
                <BottomSheetInput
                    value={value}
                    onChangeText={onChangeValue}
                    placeholder={t('savedWine.listName')}
                    containerStyle={styles.inputContainer}
                />
                <Button text={t('common.create')} onPress={onCreate} containerStyle={styles.button} disabled={!value}/>
            </BottomSheetView>
        </BottomSheetModal>
    );
};
