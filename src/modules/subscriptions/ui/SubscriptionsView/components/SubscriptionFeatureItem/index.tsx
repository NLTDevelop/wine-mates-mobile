import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { TastingIcon } from '@assets/icons/TastingIcon';
import { getStyles } from './styles';

interface IProps {
    text: string;
}

const SubscriptionFeatureItemComponent = ({ text }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <TastingIcon width={14} height={17} />
            <Typography variant="body_400" text={text} style={styles.text} />
        </View>
    );
};

export const SubscriptionFeatureItem = memo(SubscriptionFeatureItemComponent);
