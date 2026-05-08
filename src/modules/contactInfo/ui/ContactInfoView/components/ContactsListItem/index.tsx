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
import { useContactsListItem } from './presenters/useContactsListItem';
import { getStyles } from './styles';

interface IProps {
    item: IContactsListItem;
    onEditContact: (item: IContactsListItem) => void;
}

export const ContactsListItem = ({ item, onEditContact }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        onEditPress,
        onToggleVisiblePress,
        isLoading,
        contactType,
        title,
        phoneCountryCode,
    } = useContactsListItem({ item, onEditContact });

    return (
        <TouchableOpacity style={styles.container} onPress={onToggleVisiblePress} activeOpacity={0.8}>
            <View style={styles.infoContainer}>
                {contactType === 'instagram' && <InstagramIcon width={20} height={20} color={colors.text} />}
                {contactType === 'telegram' && <TelegramIcon width={20} height={20} color={colors.text} />}
                {contactType === 'facebook' && <FacebookIcon width={20} height={20} color={colors.text} />}
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
                    <EditIcon width={20} height={20} color={colors.primary} />
                </TouchableOpacity>
                <Checkbox isRound isChecked={item.isVisible} onPress={onToggleVisiblePress} disabled={isLoading} />
            </View>
        </TouchableOpacity>
    );
};
