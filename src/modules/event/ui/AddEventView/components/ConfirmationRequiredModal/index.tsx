import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { getStyles } from './styles';

interface IConfirmationRequiredItem {
    value: boolean;
    label: string;
    onPress: () => void;
}

interface IProps {
    visible: boolean;
    onClose: () => void;
    items: IConfirmationRequiredItem[];
    selectedValue?: boolean;
    onConfirm: () => void;
}

export const ConfirmationRequiredModal = ({ visible, onClose, items, selectedValue, onConfirm }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('eventDetails.confirmationAvailability')}>
            <View style={styles.container}>
                {items.map((item) => (
                    <TouchableOpacity
                        key={String(item.value)}
                        onPress={item.onPress}
                        style={[styles.option, selectedValue === item.value && styles.selectedOption]}
                    >
                        <Typography
                            variant="h6"
                            text={item.label}
                            style={[styles.optionText, selectedValue === item.value && styles.selectedOptionText]}
                        />
                    </TouchableOpacity>
                ))}
                <Button
                    text={t('common.confirm')}
                    onPress={onConfirm}
                    type="main"
                    containerStyle={styles.confirmButton}
                />
            </View>
        </BottomModal>
    );
};
