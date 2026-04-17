import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Avatar } from '@/UIKit/Avatar';
import { observer } from 'mobx-react-lite';
import { userModel } from '@/entities/users/UserModel';
import { Typography } from '@/UIKit/Typography';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon.tsx';
import { SearchIcon } from '@assets/icons/SearchIcon.tsx';
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
            <View style={styles.avatarWrapper}>
                <Avatar
                    size={40}
                    avatarUrl={userModel.user?.avatarUrl ?? null}
                    fullname={`${userModel.user?.firstName} ${userModel.user?.lastName}`}
                />
                <TouchableOpacity activeOpacity={0.7} style={styles.userNameWrapper} onPress={onProfilePress}>
                    <Typography
                        text={`Hi, ${userModel.user?.firstName} 👋🏻`}
                        variant="h5"
                    />
                    <NextArrowIcon height={20} width={20} color={colors.text} />
                </TouchableOpacity>
            </View>
            <View style={styles.actionsWrapper}>
                <TouchableOpacity activeOpacity={0.7}>
                    <SearchIcon />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                    <NotificationBadge count={10} />
                </TouchableOpacity>
            </View>
        </View>
    );
});

ScreenHeader.displayName = 'ScreenHeader';

