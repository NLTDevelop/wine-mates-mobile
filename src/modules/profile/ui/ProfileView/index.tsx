import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { FlatList, ListRenderItem, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { useProfile } from '../../presenters/useProfile';
import { Avatar } from '@/UIKit/Avatar';
import { ProfileListButton } from '../components/ProfileListButton';
import { observer } from 'mobx-react-lite';
import { IProfileButton } from '@/modules/profile/types/IProfileButton';

export const ProfileView = observer(() => {
    const { colors, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { BUTTONS, profileName, profileImageUrl, profileLevelText } = useProfile(locale);

    const keyExtractor = useCallback((item: IProfileButton) => String(item.id), []);

    const renderItem = useCallback<ListRenderItem<IProfileButton>>(({ item }) => {
        return (
            <ProfileListButton
                text={item.text}
                icon={item.icon}
                onPress={item.onPress}
                disabled={item.disabled}
            />
        );
    }, []);

    return (
        <ScreenContainer edges={['top', 'bottom']} withGradient>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Avatar
                        size={120}
                        avatarUrl={profileImageUrl}
                        fullname={profileName}
                    />
                    <Typography
                        text={profileName}
                        variant="h4"
                        style={styles.name}
                    />
                    <Typography
                        text={profileLevelText}
                        variant="body_500"
                        style={styles.expertLevel}
                    />
                </View>

                <FlatList
                    data={BUTTONS}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                />
            </View>
        </ScreenContainer>
    );
});
