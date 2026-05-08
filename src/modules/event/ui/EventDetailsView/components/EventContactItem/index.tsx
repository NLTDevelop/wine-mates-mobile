import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Flag from 'react-native-round-flags';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IEventContactOption } from '@/modules/event/ui/EventDetailsView/types/IEventContactOption';
import { FacebookIcon } from '@assets/icons/socialNetworksIcons/FacebookIcon';
import { InstagramIcon } from '@assets/icons/socialNetworksIcons/InstagramIcon';
import { TelegramIcon } from '@assets/icons/socialNetworksIcons/TelegramIcon';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';
import { getStyles } from './styles';

interface IProps {
    item: IEventContactOption;
}

export const EventContactItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.container} onPress={item.onPress} activeOpacity={0.8}>
            <View style={styles.leftContent}>
                {item.type === 'instagram' && <InstagramIcon width={24} height={24} color={colors.primary} />}
                {item.type === 'telegram' && <TelegramIcon width={24} height={24} color={colors.primary} />}
                {item.type === 'facebook' && <FacebookIcon width={24} height={24} color={colors.primary} />}
                {item.type === 'phone' && !!item.phoneCountryCode && (
                    <Flag code={item.phoneCountryCode} style={styles.flag} />
                )}
                {item.type === 'phone' && !item.phoneCountryCode && (
                    <View style={styles.placeholderFlag}>
                        <Typography text="?" variant="h6" style={styles.placeholderText} />
                    </View>
                )}
                <Typography text={item.title} variant="h6" style={styles.title} numberOfLines={1} />
            </View>
            <NextArrowIcon width={20} height={20} color={colors.text_light} />
        </TouchableOpacity>
    );
};
