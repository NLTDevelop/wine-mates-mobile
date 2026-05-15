import { useMemo } from 'react';
import { Switch, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { getStyles } from './styles';
import { useWineSetListFooter } from './presenters/useWineSetListFooter';

interface IProps {
    repeatRuleLabel: string;
    isRepeatEnabled: boolean;
    isCreating: boolean;
    isCreateEventDisabled: boolean;
    isEditMode: boolean;
    onAddWinePress: () => void;
    onOpenRepeatModal: () => void;
    onChangeRepeatSwitch: (value: boolean) => void;
    onCreateEventPress: () => void;
}

export const WineSetListFooter = ({
    repeatRuleLabel,
    isRepeatEnabled,
    isCreating,
    isCreateEventDisabled,
    isEditMode,
    onAddWinePress,
    onOpenRepeatModal,
    onChangeRepeatSwitch,
    onCreateEventPress,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { repeatValueText, repeatTitleText } = useWineSetListFooter({
        repeatRuleLabel,
        repeatTitle: t('repeatEvent.repetition'),
    });

    return (
        <View style={styles.container}>
            <Button
                text={t('event.addWine')}
                onPress={onAddWinePress}
                type="secondary"
                LeftAccessory={<PlusIcon color={colors.text} width={20} height={20} />}
            />
            <View style={styles.divider} />
            <View style={styles.repeatRow}>
                <Typography variant="h6" text={repeatTitleText} style={styles.repeatLabel} />
                <Switch onValueChange={onChangeRepeatSwitch} value={isRepeatEnabled} />
            </View>
            {isRepeatEnabled && (
                <TouchableOpacity style={styles.repeatButton} onPress={onOpenRepeatModal}>
                    <Typography variant="h6" text={repeatValueText} style={styles.repeatButtonText} numberOfLines={1} />
                    <ArrowDownIcon />
                </TouchableOpacity>
            )}
            <Button
                text={isEditMode ? t('event.updateEvent') : t('event.createEvent')}
                type="main"
                onPress={onCreateEventPress}
                inProgress={isCreating}
                disabled={isCreateEventDisabled}
                containerStyle={styles.createButton}
            />
        </View>
    );
};
