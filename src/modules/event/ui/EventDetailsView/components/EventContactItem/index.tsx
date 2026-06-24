import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IEventContactOption } from '@/modules/event/ui/EventDetailsView/types/IEventContactOption';
import { FacebookIcon } from '@assets/icons/socialNetworksIcons/FacebookIcon';
import { InstagramIcon } from '@assets/icons/socialNetworksIcons/InstagramIcon';
import { TelegramIcon } from '@assets/icons/socialNetworksIcons/TelegramIcon';
import { DiscordIcon } from '@assets/icons/socialNetworksIcons/DiscordIcon';
import { RedditIcon } from '@assets/icons/socialNetworksIcons/RedditIcon';
import { PinterestIcon } from '@assets/icons/socialNetworksIcons/PinterestIcon';
import { WhatsAppIcon } from '@assets/icons/socialNetworksIcons/WhatsAppIcon';
import { TikTokIcon } from '@assets/icons/socialNetworksIcons/TikTokIcon';
import { ThreadsIcon } from '@assets/icons/socialNetworksIcons/ThreadsIcon';
import { XIcon } from '@assets/icons/socialNetworksIcons/XIcon';
import { LinkedInIcon } from '@assets/icons/socialNetworksIcons/LinkedInIcon';
import { SnapchatIcon } from '@assets/icons/socialNetworksIcons/SnapchatIcon';
import { WebIcon } from '@assets/icons/socialNetworksIcons/WebIcon';
import { ContactType } from '@/entities/contacts/types/ContactType';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';
import { getStyles } from './styles';

interface IProps {
    item: IEventContactOption;
}

const renderSocialIcon = (contactType: ContactType) => {
    if (contactType === 'instagram') {
        return <InstagramIcon width={24} height={24} />;
    }

    if (contactType === 'telegram') {
        return <TelegramIcon width={24} height={24} />;
    }

    if (contactType === 'facebook') {
        return <FacebookIcon width={24} height={24} />;
    }

    if (contactType === 'discord') {
        return <DiscordIcon width={24} height={24} />;
    }

    if (contactType === 'reddit') {
        return <RedditIcon width={24} height={24} />;
    }

    if (contactType === 'pinterest') {
        return <PinterestIcon width={24} height={24} />;
    }

    if (contactType === 'whatsapp') {
        return <WhatsAppIcon width={24} height={24} />;
    }

    if (contactType === 'tiktok') {
        return <TikTokIcon width={24} height={24} />;
    }

    if (contactType === 'threads') {
        return <ThreadsIcon width={24} height={24} />;
    }

    if (contactType === 'x') {
        return <XIcon width={24} height={24} />;
    }

    if (contactType === 'linkedin') {
        return <LinkedInIcon width={24} height={24} />;
    }

    if (contactType === 'snapchat') {
        return <SnapchatIcon width={24} height={24} />;
    }

    if (contactType === 'website') {
        return <WebIcon width={24} height={24} />;
    }

    return null;
};

export const EventContactItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.container} onPress={item.onPress} activeOpacity={0.8}>
            <View style={styles.leftContent}>
                {renderSocialIcon(item.type)}
                <Typography text={item.title} variant="h6" style={styles.title} numberOfLines={1} />
            </View>
            <NextArrowIcon width={20} height={20} color={colors.text_light} />
        </TouchableOpacity>
    );
};
