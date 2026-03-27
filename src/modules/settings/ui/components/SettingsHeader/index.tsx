import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';
import { Avatar } from '@/UIKit/Avatar';
import { userModel } from '@/entities/users/UserModel';
import { useSettingsHeader } from '../../../presenters/useSettingsHeader';
import { observer } from 'mobx-react-lite';

export const SettingsHeader = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onProfilePress } = useSettingsHeader();

    return (
        <View style={styles.container}>
            <Avatar
                size={64}
                avatarUrl={userModel.user?.avatarUrl ?? null}
                fullname={`${userModel.user?.firstName} ${userModel.user?.lastName}`}
            />
            <TouchableOpacity style={styles.mainContainer} onPress={onProfilePress}>
                <View style={styles.row}>
                    <Typography
                        text={`${userModel.user?.firstName} ${userModel.user?.lastName}`}
                        variant="subtitle_20_500"
                    />
                    <NextArrowIcon color={colors.icon_primary} />
                </View>
                <Typography text={userModel.user?.email || '-'} variant="h6" style={styles.text} />
            </TouchableOpacity>
        </View>
    );
});
