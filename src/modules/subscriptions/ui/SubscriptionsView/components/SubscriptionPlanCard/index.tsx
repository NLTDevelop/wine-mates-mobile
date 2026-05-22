import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ISubscriptionPlanViewItem } from '@/modules/subscriptions/types/ISubscriptionPlanViewItem';
import { getStyles } from './styles';

interface IProps {
    item: ISubscriptionPlanViewItem;
}

const SubscriptionPlanCardComponent = ({ item }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(
        () => getStyles(colors, item.isPopular, item.isSelected),
        [colors, item.isPopular, item.isSelected],
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.card} onPress={item.onPress}>
                {item.isPopular ? (
                    <View style={styles.popularBadge}>
                        <Typography
                            variant="subtitle_12_500"
                            text={t('subscriptions.popular')}
                            style={styles.popularText}
                        />
                    </View>
                ) : null}
                <View style={styles.contentContainer}>
                    <View style={styles.durationContainer}>
                        <Typography variant="h4" text={item.title} />
                        <Typography variant="body_400" text={item.description} />
                    </View>
                    {item.discountLabel ? (
                        <View style={styles.discountBadge}>
                            <Typography
                                variant="subtitle_10_500"
                                text={item.discountLabel}
                                style={styles.discountText}
                            />
                        </View>
                    ) : null}
                    <View style={styles.priceContainer}>
                        <Typography variant="h4" text={item.formattedPrice} />
                        <Typography variant="subtitle_12_400" text={item.priceDescription} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export const SubscriptionPlanCard = memo(SubscriptionPlanCardComponent);
