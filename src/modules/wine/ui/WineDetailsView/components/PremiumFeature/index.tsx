import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { LockIcon } from '@assets/icons/LockIcon';
import { getStyles } from './styles';

interface IProps {
    onGetPremiumPress: () => void;
}

export const PremiumFeature = ({ onGetPremiumPress }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
                <LockIcon width={48} height={48} color={colors.primary} />
            <Typography text={t('wineMarketplace.premiumTitle')} variant="subtitle_20_700" style={styles.title} />
            <Typography
                text={t('wineMarketplace.premiumDescription')}
                variant="subtitle_12_400"
                style={styles.description}
            />
            <Button
                text={t('wineMarketplace.getPremium')}
                onPress={onGetPremiumPress}
                containerStyle={styles.button}
            />
        </View>
    );
};
