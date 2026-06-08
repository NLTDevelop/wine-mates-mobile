import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { TickIcon } from '@assets/icons/TickIcon';
import { getStyles } from './styles';
import { useWineSetListFooter } from './presenters/useWineSetListFooter';
import { Switch } from 'react-native-switch';

interface IProps {
    repeatRuleLabel: string;
    isRepeatEnabled: boolean;
    isCreating: boolean;
    isCreateEventDisabled: boolean;
    isEditMode: boolean;
    onOpenScannerPress: () => void;
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
    onOpenScannerPress,
    onAddWinePress,
    onOpenRepeatModal,
    onChangeRepeatSwitch,
    onCreateEventPress,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { repeatValueText, repeatTitleText, switchCircleSize, switchBarHeight } = useWineSetListFooter({
        repeatRuleLabel,
        repeatTitle: t('repeatEvent.repetition'),
    });

    const renderSwitchCircle = useCallback(() => {
        if (!isRepeatEnabled) {
            return null;
        }

        return <TickIcon width={16} height={16} color={colors.primary} />;
    }, [isRepeatEnabled, colors.primary]);

    return (
        <View style={styles.container}>
            <Button
                text={t('event.searchWineWithScanner')}
                onPress={onOpenScannerPress}
                type="secondary"
            />
            <Button
                text={t('event.addWine')}
                onPress={onAddWinePress}
                type="secondary"
                LeftAccessory={<PlusIcon color={colors.text} width={20} height={20} />}
            />
            <View style={styles.divider} />
            <View style={styles.repeatRow}>
                <Typography variant="h6" text={repeatTitleText} style={styles.repeatLabel} />
                <Switch
                    value={isRepeatEnabled}
                    onValueChange={onChangeRepeatSwitch}
                    circleSize={switchCircleSize}
                    barHeight={switchBarHeight}
                    circleBorderWidth={0}
                    backgroundActive={colors.primary}
                    backgroundInactive={colors.border}
                    circleActiveColor={colors.background}
                    circleInActiveColor={colors.background}
                    circleBorderActiveColor={colors.background}
                    circleBorderInactiveColor={colors.background}
                    renderInsideCircle={renderSwitchCircle}
                    changeValueImmediately
                    innerCircleStyle={styles.switchInnerCircle}
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchWidthMultiplier={2.4}
                />
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
