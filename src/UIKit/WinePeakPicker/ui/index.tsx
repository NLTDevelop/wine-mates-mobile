import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { useWinePeakPicker } from '../presenters/useWinePeakPicker';
import { YearPickerModal } from './components/YearPickerModal';
import { getStyles } from './styles';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { userModel } from '@/entities/users/UserModel';
import { observer } from 'mobx-react-lite';
import { LockContainer } from '@/UIKit/LockContainer';

interface IProps {
    value: number | null;
    onChange: (year: number | null) => void;
    isPremiumLockEnabled?: boolean;
}

export const WinePeakPicker = observer(({ value, onChange, isPremiumLockEnabled = true }: IProps) => {
    const { colors, t } = useUiContext();
    const isPremiumUser = userModel.user?.hasPremium || false;
    const hasAccess = !isPremiumLockEnabled || isPremiumUser;
    const styles = useMemo(() => getStyles(colors, hasAccess), [colors, hasAccess]);

    const {
        selectedYear,
        setSelectedYear,
        displayYear,
        currentYear,
        isVisible,
        onOpen,
        onClose,
        onConfirm,
        onReset,
    } = useWinePeakPicker({ value, onChange });

    return (
        <>
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <Typography text={t('wine.winePeak')} variant="h6" />
                    <Typography text={t('wine.winePeakDescription')} variant="subtitle_12_400" style={styles.description} />
                </View>
                <View style={styles.pickerRow}>
                    <TouchableOpacity
                        onPress={onOpen}
                        style={styles.pickerButton}
                        disabled={!hasAccess}
                        activeOpacity={0.75}
                    >
                        <Typography
                            text={displayYear}
                            variant="h6"
                            style={styles.pickerText}
                        />
                        {!hasAccess && (
                            <View style={styles.crownIconContainer}>
                                <CrownIcon />
                            </View>
                        )}
                        {!hasAccess && <LockContainer/>}
                    </TouchableOpacity>
                    {value && hasAccess && (
                        <TouchableOpacity onPress={onReset} style={styles.resetButton} activeOpacity={0.75}>
                            <CrossIcon width={20} height={20} color={colors.icon_inverted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <YearPickerModal
                visible={isVisible}
                onClose={onClose}
                onConfirm={onConfirm}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                currentYear={currentYear}
                title={t('wine.winePeak')}
                confirmText={t('common.confirm')}
            />
        </>
    );
});

WinePeakPicker.displayName = 'WinePeakPicker';
