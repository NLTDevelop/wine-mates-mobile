import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { ISingleSelectModalItem } from '../../types/ISingleSelectModalItem';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    items: ISingleSelectModalItem[];
    onConfirm: () => void;
}

export const SingleSelectModal = ({ visible, title, onClose, items, onConfirm }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <BottomModal visible={visible} onClose={onClose} title={title}>
            <View style={styles.container}>
                {items.map((item) => (
                    <TouchableOpacity
                        key={item.key}
                        onPress={item.onPress}
                        style={[styles.option, item.isSelected && styles.selectedOption]}
                    >
                        <Typography
                            variant="h6"
                            text={item.label}
                            style={[styles.optionText, item.isSelected && styles.selectedOptionText]}
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
