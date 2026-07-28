import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { useWinePeakPicker } from '../presenters/useWinePeakPicker';
import { YearPickerModal } from './components/YearPickerModal';
import { getStyles } from './styles';
import { CrossIcon } from '@assets/icons/CrossIcon';

interface IProps {
    value: number | null;
    onChange: (year: number | null) => void;
}

export const WinePeakPicker = ({ value, onChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

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
                        activeOpacity={0.75}
                    >
                        <Typography
                            text={displayYear}
                            variant="h6"
                            style={styles.pickerText}
                        />
                    </TouchableOpacity>
                    {value ? (
                        <TouchableOpacity onPress={onReset} style={styles.resetButton} activeOpacity={0.75}>
                            <CrossIcon width={20} height={20} color={colors.icon_inverted} />
                        </TouchableOpacity>
                    ) : null}
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
};

WinePeakPicker.displayName = 'WinePeakPicker';
