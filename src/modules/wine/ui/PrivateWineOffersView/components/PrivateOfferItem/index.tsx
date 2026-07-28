import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Avatar } from '@/UIKit/Avatar';
import { Typography } from '@/UIKit/Typography';
import { IPrivateOfferListItem } from '@/modules/wine/types/IPrivateOfferListItem';
import { getStyles } from './styles';

interface IProps {
    item: IPrivateOfferListItem;
}

export const PrivateOfferItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Avatar size={36} avatarUrl={item.avatarUrl} fullname={item.fullName} />
            <Typography text={item.fullName} variant="subtitle_12_500" numberOfLines={2} style={styles.name} />
            <View style={styles.price}>
                <Typography text={item.priceText} variant="subtitle_12_500" style={styles.priceText} />
            </View>
        </View>
    );
};
