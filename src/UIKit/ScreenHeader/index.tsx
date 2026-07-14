import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Avatar } from '@/UIKit/Avatar';
import { observer } from 'mobx-react-lite';
import { Typography } from '@/UIKit/Typography';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon.tsx';
import { NotificationBadge } from '@/UIKit/NotificationBadge';
import { useScreenHeader } from './presenters/useScreenHeader';

export const ScreenHeader = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        avatarUrl,
        fullname,
        greeting,
        onProfilePress,
        onNotificationsPress,
    } = useScreenHeader();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={onProfilePress}>
                <Avatar
                    size={40}
                    avatarUrl={avatarUrl}
                    fullname={fullname}
                />
                <View style={styles.userNameWrapper} >
                    <Typography text={greeting} variant="h5" />
                    <NextArrowIcon height={20} width={20} color={colors.text} />
                </View>
            </TouchableOpacity>
            <NotificationBadge onPress={onNotificationsPress} />
        </View>
    );
});

ScreenHeader.displayName = 'ScreenHeader';
