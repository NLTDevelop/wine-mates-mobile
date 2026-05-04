import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { getStyles } from './styles';
import { useWineSetListFooter } from './presenters/useWineSetListFooter';

interface IProps {
    repeatRuleLabel: string;
    isCreating: boolean;
    isCreateEventDisabled: boolean;
    onAddWinePress: () => void;
    onOpenRepeatModal: () => void;
    onCreateEventPress: () => void;
}

export const WineSetListFooter = ({
    repeatRuleLabel,
    isCreating,
    isCreateEventDisabled,
    onAddWinePress,
    onOpenRepeatModal,
    onCreateEventPress,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { repeatValueText, repeatTitleText } = useWineSetListFooter({
        repeatRuleLabel,
        repeatTitle: t('event.repeat'),
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
                <TouchableOpacity style={styles.repeatButton} onPress={onOpenRepeatModal}>
                    <Typography variant="h6" text={repeatValueText} style={styles.repeatButtonText} />
                    <ArrowDownIcon />
                </TouchableOpacity>
            </View>

            <Button
                text={t('event.createEvent')}
                type="main"
                onPress={onCreateEventPress}
                inProgress={isCreating}
                disabled={isCreateEventDisabled}
                containerStyle={styles.createButton}
            />
        </View>
    );
};
