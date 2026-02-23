import { memo, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { useWinePeakPicker } from './useWinePeakPicker';
import { YearPickerModal } from './YearPickerModal';
import { getStyles } from './styles';

interface IProps {
    value: number | null;
    onChange: (year: number | null) => void;
}

export const WinePeakPicker = memo(({ value, onChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

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
                <Pressable onPress={handleOpen} style={styles.pickerButton}>
                    <Typography
                        text={displayYear}
                        variant="h6"
                        style={styles.pickerText}
                    />
                </Pressable>
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
