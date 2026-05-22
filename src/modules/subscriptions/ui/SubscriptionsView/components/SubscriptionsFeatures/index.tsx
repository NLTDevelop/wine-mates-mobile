import { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { SubscriptionFeatureItem } from '../SubscriptionFeatureItem';

interface IProps {
    subscriptionFeatures: string[];
}

const SubscriptionsFeaturesComponent = ({ subscriptionFeatures }: IProps) => {
    const { t } = useUiContext();
    const styles = useMemo(() => getStyles(), []);

    const featureKeyExtractor = useCallback((item: string, index: number) => `${item}-${index}`, []);

    const renderFeatureItem = useCallback(({ item }: ListRenderItemInfo<string>) => {
        return <SubscriptionFeatureItem text={item} />;
    }, []);

    return (
        <View style={styles.container}>
            <Typography variant="h3" text={t('subscriptions.suitableForEveryone')} style={styles.title} />
            <FlatList
                data={subscriptionFeatures}
                keyExtractor={featureKeyExtractor}
                renderItem={renderFeatureItem}
                scrollEnabled={false}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

export const SubscriptionsFeatures = memo(SubscriptionsFeaturesComponent);
