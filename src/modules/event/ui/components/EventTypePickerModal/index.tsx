import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { EventType } from '@/entities/events/enums/EventType';
import { useEventTypePickerModal } from './presenters/useEventTypePickerModal';

interface IProps {
    visible: boolean;
    selectedType: EventType;
    onClose: () => void;
    onSelectType: (type: EventType) => void;
}

export const EventTypePickerModal = ({ visible, selectedType, onClose, onSelectType }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        tastingsLabel,
        partiesLabel,
        onSelectTastings,
        onSelectParties,
    } = useEventTypePickerModal({ t, onSelectType });

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('event.eventType')}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.option, selectedType === EventType.Tastings && styles.selectedOption]}
                    onPress={onSelectTastings}
                >
                    <Typography
                        variant="h6"
                        text={tastingsLabel}
                        style={[styles.optionText, selectedType === EventType.Tastings && styles.selectedOptionText]}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.option, selectedType === EventType.Parties && styles.selectedOption]}
                    onPress={onSelectParties}
                >
                    <Typography
                        variant="h6"
                        text={partiesLabel}
                        style={[styles.optionText, selectedType === EventType.Parties && styles.selectedOptionText]}
                    />
                </TouchableOpacity>
            </View>
        </BottomModal>
    );
};
