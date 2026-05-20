import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { RepeatRuleFrequency } from '@/entities/events/enums/RepeatRuleFrequency';

interface IProps {
    intervalItems: IDropdownItem[];
    repeatInterval: number;
    onSelectInterval: (item: IDropdownItem) => void;
    frequencyItems: IDropdownItem[];
    frequency: RepeatRuleFrequency;
    onSelectFrequency: (item: IDropdownItem) => void;
}

const CustomRepeatEventIntervalComponent = ({
    intervalItems,
    repeatInterval,
    onSelectInterval,
    frequencyItems,
    frequency,
    onSelectFrequency,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <View style={styles.intervalRow}>
                <Typography
                    text={t('repeatEvent.repeatWithInterval')}
                    variant="h6"
                    style={styles.intervalLabel}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    numberOfLines={2}
                />
                <CustomDropdown
                    placeholder={t('repeatEvent.interval')}
                    data={intervalItems}
                    selectedValue={repeatInterval}
                    onPress={onSelectInterval}
                    containerStyle={styles.intervalDropdown}
                    fixAndroidDropdownGap
                />
                <CustomDropdown
                    placeholder={t('repeatEvent.frequency')}
                    data={frequencyItems}
                    selectedValue={frequency}
                    onPress={onSelectFrequency}
                    containerStyle={styles.frequencyDropdown}
                    fixAndroidDropdownGap
                />
            </View>
        </View>
    );
};

export const CustomRepeatEventInterval = memo(CustomRepeatEventIntervalComponent);
