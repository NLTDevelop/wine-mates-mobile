import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { Sex } from '@/entities/events/enums/Sex';
import { useSexPickerModal } from './presenters/useSexPickerModal';

interface IProps {
    visible: boolean;
    selectedSex?: Sex;
    onClose: () => void;
    onSelectSex: (sex: Sex) => void;
}

export const SexPickerModal = ({ visible, selectedSex, onClose, onSelectSex }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { menLabel, womenLabel, allLabel, onSelectMen, onSelectWomen, onSelectAll } = useSexPickerModal({
        t,
        onSelectSex,
    });

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('eventFilters.sex')}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.option, selectedSex === Sex.All && styles.selectedOption]}
                    onPress={onSelectAll}
                >
                    <Typography
                        variant="h6"
                        text={allLabel}
                        style={[styles.optionText, selectedSex === Sex.All && styles.selectedOptionText]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.option, selectedSex === Sex.Men && styles.selectedOption]}
                    onPress={onSelectMen}
                >
                    <Typography
                        variant="h6"
                        text={menLabel}
                        style={[styles.optionText, selectedSex === Sex.Men && styles.selectedOptionText]}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.option, selectedSex === Sex.Women && styles.selectedOption]}
                    onPress={onSelectWomen}
                >
                    <Typography
                        variant="h6"
                        text={womenLabel}
                        style={[styles.optionText, selectedSex === Sex.Women && styles.selectedOptionText]}
                    />
                </TouchableOpacity>
            </View>
        </BottomModal>
    );
};
