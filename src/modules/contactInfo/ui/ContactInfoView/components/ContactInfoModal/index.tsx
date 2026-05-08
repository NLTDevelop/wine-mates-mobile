import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { BottomSheetInput } from '@/UIKit/BottomSheetInput';
import { Button } from '@/UIKit/Button';
import { getStyles } from './styles';

interface IProps {
    isVisible: boolean;
    title: string;
    value: string;
    onChangeValue: (value: string) => void;
    onClose: () => void;
    onSave: () => void;
    isSaving: boolean;
    isSaveDisabled: boolean;
}

export const ContactInfoModal = ({
    isVisible,
    title,
    value,
    onChangeValue,
    onClose,
    onSave,
    isSaving,
    isSaveDisabled,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <BottomModal visible={isVisible} onClose={onClose} title={title}>
            <View style={styles.container}>
                <BottomSheetInput
                    value={value}
                    onChangeText={onChangeValue}
                    placeholder={t('contactInfo.contactValue')}
                    containerStyle={styles.inputContainer}
                    onSubmitEditing={onSave}
                    returnKeyType="done"
                />
                <Button
                    text={t('common.save')}
                    onPress={onSave}
                    containerStyle={styles.button}
                    disabled={isSaveDisabled}
                    inProgress={isSaving}
                />
            </View>
        </BottomModal>
    );
};
