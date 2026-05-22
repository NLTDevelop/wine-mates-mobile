import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { Loader } from '@/UIKit/Loader';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { getStyles } from './styles';
import { useSubscriptions } from '../../presenters/useSubscriptions';
import { SubscriptionPlanCard } from './components/SubscriptionPlanCard';
import { ISubscriptionPlanViewItem } from '../../types/ISubscriptionPlanViewItem';
import { SubscriptionsFeatures } from './components/SubscriptionsFeatures';

export const SubscriptionsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { subscriptionFeatures, subscriptions, isLoading, isNeedShowTrialButton, onStartTrialPress } =
        useSubscriptions();

    const subscriptionKeyExtractor = useCallback((item: ISubscriptionPlanViewItem) => item.id, []);

    const renderSubscriptionItem = useCallback(({ item }: ListRenderItemInfo<ISubscriptionPlanViewItem>) => {
        return <SubscriptionPlanCard item={item} />;
    }, []);

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            scrollEnabled
            contentContainerStyle={styles.contentContainerStyle}
            headerComponent={<HeaderWithBackButton title={t('subscriptions.subscription')} isCentered />}
        >
            {isLoading ? (
                <Loader />
            ) : (
                <View style={styles.container}>
                    <View style={styles.imageTitleContainer}>
                        <View style={styles.iconContainer}>
                            <CrownIcon width={32} height={32} />
                        </View>
                        <Typography variant="h4" text={t('subscriptions.heroTitle')} style={styles.title} />
                    </View>
                    <View style={styles.infoContainer}>
                        <SubscriptionsFeatures subscriptionFeatures={subscriptionFeatures} />
                        <FlatList
                            data={subscriptions}
                            keyExtractor={subscriptionKeyExtractor}
                            renderItem={renderSubscriptionItem}
                            horizontal
                            scrollEnabled={false}
                            contentContainerStyle={styles.subscriptionsList}
                        />
                        {isNeedShowTrialButton ? (
                            <Button text={t('subscriptions.startTrial')} onPress={onStartTrialPress} />
                        ) : null}
                    </View>
                </View>
            )}
        </ScreenContainer>
    );
});
