import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { RepeatRule } from '@/entities/events/enums/RepeatRule';

interface IRepeatRuleItem {
    value: RepeatRule;
    label: string;
    onPress: () => void;
}

interface IProps {
    visible: boolean;
    onClose: () => void;
    items: IRepeatRuleItem[];
    selectedValue: RepeatRule;
}

export const RepeatRuleModal = ({ visible, onClose, items, selectedValue }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('event.repeat')}>
            <View style={styles.container}>
                {items.map((item) => (
                    <TouchableOpacity
                        key={item.value}
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
            </View>
        </BottomModal>
    );
};
