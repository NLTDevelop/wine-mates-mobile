import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Avatar } from '@/UIKit/Avatar';
import { observer } from 'mobx-react-lite';
import { userModel } from '@/entities/users/UserModel';
import { Typography } from '@/UIKit/Typography';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon.tsx';
import { NotificationBadge } from '@/UIKit/NotificationBadge';
import { useNavigation } from '@react-navigation/native';

export const ScreenHeader = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const navigation = useNavigation<any>();

    const onProfilePress = useCallback(() => {
        navigation.navigate('ProfileDetailsView');
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={onProfilePress}>
                <Avatar
                    size={40}
                    avatarUrl={userModel.user?.avatarUrl ?? null}
                    fullname={`${userModel.user?.firstName} ${userModel.user?.lastName}`}
                />
                <View style={styles.userNameWrapper} >
                    <Typography text={`Hi, ${userModel.user?.firstName} 👋🏻`} variant="h5" />
                    <NextArrowIcon height={20} width={20} color={colors.text} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <NotificationBadge count={0} />
            </TouchableOpacity>
        </View>
    );
});

ScreenHeader.displayName = 'ScreenHeader';
