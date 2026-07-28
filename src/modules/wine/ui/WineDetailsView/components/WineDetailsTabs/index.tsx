import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { getStyles } from './styles';

interface IProps {
    isProfileActive: boolean;
    isEvolutionActive: boolean;
    isPurchaseActive: boolean;
    onProfilePress: () => void;
    onEvolutionPress: () => void;
    onPurchasePress: () => void;
    compactBottomSpacing?: boolean;
}

export const WineDetailsTabs = ({
    isProfileActive,
    isEvolutionActive,
    isPurchaseActive,
    onProfilePress,
    onEvolutionPress,
    onPurchasePress,
    compactBottomSpacing = false,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={[styles.container, compactBottomSpacing ? styles.compactBottomSpacing : undefined]}>
            <TouchableOpacity style={styles.item} onPress={onProfilePress}>
                <Typography
                    text={t('wineMarketplace.profileTab')}
                    variant="body_400"
                    style={isProfileActive ? styles.activeText : styles.text}
                />
                {isProfileActive ? <View style={styles.indicator} /> : null}
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={onEvolutionPress}>
                <View style={styles.row}>
                    <CrownIcon width={14} height={14} />
                    <Typography
                        text={t('wineMarketplace.evolutionTab')}
                        variant="body_400"
                        style={isEvolutionActive ? styles.activeText : styles.text}
                    />
                </View>
                {isEvolutionActive ? <View style={styles.indicator} /> : null}
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={onPurchasePress}>
                <Typography
                    text={t('wineMarketplace.purchaseTab')}
                    variant="body_400"
                    style={isPurchaseActive ? styles.activeText : styles.text}
                />
                {isPurchaseActive ? <View style={styles.indicator} /> : null}
            </TouchableOpacity>
        </View>
    );
};
