import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { useProfile } from '../../presenters/useProfile';
import { Avatar } from '@/UIKit/Avatar';
import { userModel } from '@/entities/users/UserModel';
import { ProfileListButton } from '../components/ProfileListButton';

export const ProfileView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { BUTTONS } = useProfile();

    return (
        <ScreenContainer edges={['top', 'bottom']} withGradient>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Avatar
                        size={72}
                        avatarUrl={userModel.user?.avatarUrl ?? null}
                        fullname={`${userModel.user?.firstName} ${userModel.user?.lastName}`}
                    />
                    <Typography
                        text={`${userModel.user?.firstName} ${userModel.user?.lastName}`}
                        variant="h4"
                        style={styles.name}
                    />
                    <Typography
                        text={t(`wineLevel.${userModel.user?.wineExperienceLevel}`)}
                        variant="body_500"
                        style={styles.expertLevel}
                    />
                </View>

                {BUTTONS.map(item => (
                    <ProfileListButton key={item.id} text={item.text} icon={item.icon} onPress={item.onPress} />
                ))}
            </View>
        </ScreenContainer>
    );
};
