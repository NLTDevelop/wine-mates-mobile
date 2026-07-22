import { memo, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IPublicProfileLinkItem } from '@/modules/profile/types/IPublicProfileLinkItem';
import { Typography } from '@/UIKit/Typography';
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
import { getStyles } from './styles';

interface IProps {
    item: IPublicProfileLinkItem;
}

const PublicProfileLinkItemComponent = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    let icon = <WebIcon width={20} height={20} />;

    if (item.contactType === 'instagram') icon = <InstagramIcon width={20} height={20} />;
    else if (item.contactType === 'telegram') icon = <TelegramIcon width={20} height={20} />;
    else if (item.contactType === 'facebook') icon = <FacebookIcon width={20} height={20} />;
    else if (item.contactType === 'discord') icon = <DiscordIcon width={20} height={20} />;
    else if (item.contactType === 'reddit') icon = <RedditIcon width={20} height={20} />;
    else if (item.contactType === 'pinterest') icon = <PinterestIcon width={20} height={20} />;
    else if (item.contactType === 'whatsapp') icon = <WhatsAppIcon width={20} height={20} />;
    else if (item.contactType === 'tiktok') icon = <TikTokIcon width={20} height={20} />;
    else if (item.contactType === 'threads') icon = <ThreadsIcon width={20} height={20} />;
    else if (item.contactType === 'x') icon = <XIcon width={20} height={20} />;
    else if (item.contactType === 'linkedin') icon = <LinkedInIcon width={20} height={20} />;
    else if (item.contactType === 'snapchat') icon = <SnapchatIcon width={20} height={20} />;

    return (
        <TouchableOpacity style={styles.item} onPress={item.onPress} activeOpacity={0.8}>
            {icon}
            <Typography text={item.title} variant="body_500" style={styles.itemText} numberOfLines={1} />
        </TouchableOpacity>
    );
};

export const PublicProfileLinkItem = memo(PublicProfileLinkItemComponent);
