import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { Checkbox } from '@/UIKit/Checkbox';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';

interface IProps {
    onSelectNeverEndCondition: () => void;
    isNeverEndConditionSelected: boolean;
    onSelectDateEndCondition: () => void;
    isDateEndConditionSelected: boolean;
    isDateControlDisabled: boolean;
    onOpenCalendar: () => void;
    formattedEndDate: string;
    onSelectCountEndCondition: () => void;
    isCountEndConditionSelected: boolean;
    isCountControlDisabled: boolean;
    repetitionCountItems: IDropdownItem[];
    repetitionCount: number;
    onSelectRepetitionCount: (item: IDropdownItem) => void;
}

const CustomRepeatEventEndConditionComponent = ({
    onSelectNeverEndCondition,
    isNeverEndConditionSelected,
    onSelectDateEndCondition,
    isDateEndConditionSelected,
    isDateControlDisabled,
    onOpenCalendar,
    formattedEndDate,
    onSelectCountEndCondition,
    isCountEndConditionSelected,
    isCountControlDisabled,
    repetitionCountItems,
    repetitionCount,
    onSelectRepetitionCount,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography text={t('repeatEvent.theEnd')} variant="h6" style={styles.label} />
            <View style={styles.endConditionRow}>
                <TouchableOpacity style={styles.endConditionLabelButton} onPress={onSelectNeverEndCondition}>
                    <View pointerEvents="none">
                        <Checkbox
                            isChecked={isNeverEndConditionSelected}
                            isRound
                            onPress={onSelectNeverEndCondition}
                            containerStyles={styles.checkbox}
                            iconSize={16}
                        />
                    </View>
                    <Typography text={t('repeatEvent.never')} variant="h6" style={styles.endConditionText} />
                </TouchableOpacity>
            </View>
            <View style={styles.endConditionRow}>
                <TouchableOpacity style={styles.endConditionLabelButton} onPress={onSelectDateEndCondition}>
                    <View pointerEvents="none">
                        <Checkbox
                            isChecked={isDateEndConditionSelected}
                            isRound
                            onPress={onSelectDateEndCondition}
                            containerStyles={styles.checkbox}
                            iconSize={16}
                        />
                    </View>
                    <Typography text={t('repeatEvent.date')} variant="h6" style={styles.endConditionText} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.endConditionDropdown, isDateControlDisabled && styles.endConditionDropdownDisabled]}
                    onPress={onOpenCalendar}
                    disabled={isDateControlDisabled}
                >
                    <Typography text={formattedEndDate} variant="h6" style={styles.dateButtonText} />
                    <ArrowDownIcon />
                </TouchableOpacity>
            </View>
            <View style={styles.endConditionRow}>
                <TouchableOpacity style={styles.endConditionLabelButton} onPress={onSelectCountEndCondition}>
                    <View pointerEvents="none">
                        <Checkbox
                            isChecked={isCountEndConditionSelected}
                            isRound
                            onPress={onSelectCountEndCondition}
                            containerStyles={styles.checkbox}
                            iconSize={16}
                        />
                    </View>
                    <Typography text={t('repeatEvent.after')} variant="h6" style={styles.endConditionText} />
                </TouchableOpacity>
                <CustomDropdown
                    placeholder={t('repeatEvent.repetitions')}
                    data={repetitionCountItems}
                    selectedValue={repetitionCount}
                    onPress={onSelectRepetitionCount}
                    containerStyle={styles.endConditionDropdown}
                    dropdownContainerStyle={styles.dropdownMenu}
                    disabled={isCountControlDisabled}
                    fixAndroidDropdownGap
                />
            </View>
        </View>
    );
};

export const CustomRepeatEventEndCondition = memo(CustomRepeatEventEndConditionComponent);
