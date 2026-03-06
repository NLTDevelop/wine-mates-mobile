import { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { useWinePeakPicker } from './useWinePeakPicker';
import { YearPickerModal } from './YearPickerModal';
import { getStyles } from './styles';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { userModel } from '@/entities/users/UserModel';
import { observer } from 'mobx-react-lite';
import { LockContainer } from '@/UIKit/LockContainer';

interface IProps {
    value: number | null;
    onChange: (year: number | null) => void;
}

export const WinePeakPicker = observer(({ value, onChange }: IProps) => {
    const { colors, t } = useUiContext();
    const isPremiumUser = userModel.user?.hasPremium || false;
    const styles = useMemo(() => getStyles(colors, isPremiumUser), [colors, isPremiumUser]);

    const {
        selectedYear,
        setSelectedYear,
        displayYear,
        currentYear,
        isVisible,
        handleOpen,
        handleClose,
        onConfirm,
        handleReset,
    } = useWinePeakPicker({ value, onChange });

    return (
        <>
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <Typography text={t('wine.winePeak')} variant="h6" />
                    <Typography text={t('wine.winePeakDescription')} variant="subtitle_12_400" style={styles.description} />
                </View>
                <View style={styles.pickerRow}>
                    <Pressable onPress={isPremiumUser ? handleOpen : undefined} style={styles.pickerButton} disabled={!isPremiumUser}>
                        <Typography
                            text={displayYear}
                            variant="h6"
                            style={styles.pickerText}
                        />
                        {!isPremiumUser && (
                            <View style={styles.crownIconContainer}>
                                <CrownIcon />
                            </View>
                        )}
                        {!isPremiumUser && <LockContainer/>}
                    </Pressable>
                    {value && isPremiumUser && (
                        <Pressable onPress={handleReset} style={styles.resetButton}>
                            <CrossIcon width={20} height={20} color={colors.icon_inverted} />
                        </Pressable>
                    )}
                </View>
            </View>
            <YearPickerModal
                visible={isVisible}
                onClose={handleClose}
                onConfirm={onConfirm}
                onReset={handleReset}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                currentYear={currentYear}
                title={t('wine.winePeak')}
                confirmText={t('common.confirm')}
                resetText={t('common.reset')}
            />
        </>
    );
});

WinePeakPicker.displayName = 'WinePeakPicker';
