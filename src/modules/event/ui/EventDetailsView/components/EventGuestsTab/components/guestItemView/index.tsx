import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Avatar } from '@/UIKit/Avatar';
import { Button } from '@/UIKit/Button';
import { Typography } from '@/UIKit/Typography';
import { IPreparedEventGuest } from '../../../../types/IPreparedEventGuest';

type IProps = Omit<IPreparedEventGuest, 'id'>;

const GuestItemViewComponent = ({
    fullName,
    avatarUrl,
    ageText,
    primaryAction,
    secondaryAction,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, !!primaryAction), [colors, primaryAction]);

    return (
        <View style={styles.container}>
            <View style={styles.userAvatarInfoContainer}>
                <Avatar size={40} avatarUrl={avatarUrl} fullname={fullName} />
                <View style={styles.userInfoContainer}>
                    <Typography variant="body_500" text={fullName} style={styles.fullname} numberOfLines={1} />
                    <Typography variant="subtitle_12_400" text={ageText} style={styles.age} />
                </View>
            </View>
            {primaryAction ? (
                <View style={styles.actionsContainer}>
                    {secondaryAction ? (
                        <Button
                            containerStyle={styles.buttonStyle}
                            text={secondaryAction.title}
                            type={secondaryAction.type}
                            onPress={secondaryAction.onPress}
                            inProgress={secondaryAction.inProgress}
                            textStyle={styles.secondaryText}
                        />
                    ) : null}
                    <Button
                        containerStyle={styles.buttonStyle}
                        text={primaryAction.title}
                        type={primaryAction.type}
                        onPress={primaryAction.onPress}
                        inProgress={primaryAction.inProgress}
                    />
                </View>
            ) : null}
        </View>
    );
};

export const GuestItemView = memo(GuestItemViewComponent);
