import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Flag from 'react-native-round-flags';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IContactsListItem } from '@/entities/contacts/types/IContactsListItem';
import { EditIcon } from '@assets/icons/EditIcon';
import { Checkbox } from '@/UIKit/Checkbox';
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
import { DeleteForeverIcon } from '@assets/icons/DeleteForeverIcon';
import { DeleteContactAlert } from '../DeleteContactAlert';
import { useContactsListItem } from './presenters/useContactsListItem';
import { getStyles } from './styles';

interface IProps {
    item: IContactsListItem;
    onEditContact: (item: IContactsListItem) => void;
}

const renderSocialIcon = (contactType: ContactType) => {
    if (contactType === 'instagram') {
        return <InstagramIcon width={20} height={20} />;
    }

    if (contactType === 'telegram') {
        return <TelegramIcon width={20} height={20} />;
    }

    if (contactType === 'facebook') {
        return <FacebookIcon width={20} height={20} />;
    }

    if (contactType === 'discord') {
        return <DiscordIcon width={20} height={20} />;
    }

    if (contactType === 'reddit') {
        return <RedditIcon width={20} height={20} />;
    }

    if (contactType === 'pinterest') {
        return <PinterestIcon width={20} height={20} />;
    }

    if (contactType === 'whatsapp') {
        return <WhatsAppIcon width={20} height={20} />;
    }

    if (contactType === 'tiktok') {
        return <TikTokIcon width={20} height={20} />;
    }

    if (contactType === 'threads') {
        return <ThreadsIcon width={20} height={20} />;
    }

    if (contactType === 'x') {
        return <XIcon width={20} height={20} />;
    }

    if (contactType === 'linkedin') {
        return <LinkedInIcon width={20} height={20} />;
    }

    if (contactType === 'snapchat') {
        return <SnapchatIcon width={20} height={20} />;
    }

    if (contactType === 'website') {
        return <WebIcon width={20} height={20} />;
    }

    return null;
};

export const ContactsListItem = ({ item, onEditContact }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        onEditPress,
        onToggleVisiblePress,
        onOpenDeleteAlert,
        onCloseDeleteAlert,
        onDeletePress,
        isLoading,
        isDeleteAlertVisible,
        contactType,
        title,
        phoneCountryCode,
    } = useContactsListItem({ item, onEditContact });

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={onToggleVisiblePress} activeOpacity={0.8}>
                <View style={styles.infoContainer}>
                    {renderSocialIcon(contactType)}
                    {contactType === 'phone' && !!phoneCountryCode && (
                        <Flag code={phoneCountryCode} style={styles.flag} />
                    )}
                    {contactType === 'phone' && !phoneCountryCode && (
                        <View style={styles.placeholderFlag}>
                            <Typography text="?" variant="h6" style={styles.placeholderText} />
                        </View>
                    )}
                    <Typography text={title} variant="body_500" style={styles.title} numberOfLines={1} />
                </View>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={onEditPress} style={styles.editButton} hitSlop={10}>
                        <EditIcon width={24} height={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onOpenDeleteAlert} style={styles.deleteButton} hitSlop={10}>
                        <DeleteForeverIcon width={24} height={24} color={colors.primary} />
                    </TouchableOpacity>
                    <Checkbox isRound isChecked={item.isVisible} onPress={onToggleVisiblePress} disabled={isLoading} />
                </View>
            </TouchableOpacity>
            <DeleteContactAlert
                visible={isDeleteAlertVisible}
                onClose={onCloseDeleteAlert}
                onConfirm={onDeletePress}
                isLoading={isLoading}
            />
        </>
    );
};
