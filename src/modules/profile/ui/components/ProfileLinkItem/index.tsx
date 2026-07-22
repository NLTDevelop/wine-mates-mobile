import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IProfileLinkItem } from '@/modules/profile/types/IProfileLinkItem';
import { WebIcon } from '@assets/icons/socialNetworksIcons/WebIcon';
import { CopyIcon } from '@assets/icons/CopyIcon';
import { useProfileLinkItem } from '@/modules/profile/presenters/useProfileLinkItem';
import { getStyles } from './styles';

interface IProps {
    item: IProfileLinkItem;
}

const ProfileLinkItemComponent = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPress } = useProfileLinkItem(item.url);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.infoContainer}>
                <WebIcon width={20} height={20} />
                <Typography text={item.title} variant="body_500" style={styles.title} numberOfLines={1} />
            </View>
            <CopyIcon width={20} height={20} color={colors.primary} />
        </TouchableOpacity>
    );
};

export const ProfileLinkItem = memo(ProfileLinkItemComponent);
