import { useMemo } from 'react';
import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { ITasteProfileTopWinePeak } from '@/entities/wine/types/ITasteProfile';
import { declOfWord, getContrastColor } from '@/utils';
import { getStyles } from './styles';

interface IProps {
    peaks: ITasteProfileTopWinePeak[];
}

export const WinePeaksGrid = ({ peaks }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const title = t('wine.winePeak');
    const textColor = getContrastColor(colors.primary);

    return (
        <>
            <View style={styles.titleContainer}>
                <Typography text={title} variant="h4" />
                <Typography text={t('wine.mostSelected')} variant="body_400" style={styles.text} />
            </View>
            <View style={styles.gridContainer}>
                {peaks.map((peak, index) => (
                    <View key={`${peak.year}-${index}`} style={styles.gridItem}>
                        <Typography text={String(peak.year)} variant="h6" style={{ color: textColor }} />
                        <Typography
                            text={`(${declOfWord(
                                Number(peak.userCount),
                                t('scanner.reviewCount') as unknown as Array<string>,
                            )})`}
                            variant="subtitle_12_500"
                            style={{ color: `${textColor}B3` }}
                        />
                    </View>
                ))}
            </View>
        </>
    );
};
