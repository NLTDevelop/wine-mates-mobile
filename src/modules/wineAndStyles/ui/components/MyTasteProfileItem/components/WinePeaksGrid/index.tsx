import { useMemo } from 'react';
import { View } from 'react-native';
import { Collapse } from '@/UIKit/Collapse';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { ITasteProfileTopWinePeak } from '@/entities/wine/types/ITasteProfile';
import { declOfWord } from '@/utils';
import { getStyles } from './styles';

interface IProps {
    peaks: ITasteProfileTopWinePeak[];
}

export const WinePeaksGrid = ({ peaks }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const title = t('wineAndStyles.winePeaks');

    return (
        <View style={styles.nestedCollapseWrapper}>
            <Collapse title={`${title} (${peaks.length})`}>
                <View style={styles.gridContainer}>
                    {peaks.map((peak, index) => (
                        <View key={`${peak.year}-${index}`} style={styles.gridItem}>
                            <Typography text={String(peak.year)} variant="h6" style={styles.yearText} />
                            <Typography
                                text={`(${declOfWord(
                                    Number(peak.userCount),
                                    t('scanner.reviewCount') as unknown as Array<string>,
                                )})`}
                                variant="subtitle_12_500"
                                style={styles.countText}
                            />
                        </View>
                    ))}
                </View>
            </Collapse>
        </View>
    );
};
