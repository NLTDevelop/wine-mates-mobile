import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Avatar } from '@/UIKit/Avatar';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    name: string;
    avatarUrl: string | null;
    details?: string;
    statusLabel?: string;
    isVerified?: boolean;
    galleryBadgeText?: string;
    hasLinks: boolean;
    onAvatarPress?: () => void;
    onLinksPress: () => void;
}

export const PublicProfileHeader = ({
    name,
    avatarUrl,
    details,
    statusLabel,
    isVerified = false,
    galleryBadgeText,
    hasLinks,
    onAvatarPress,
    onLinksPress,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <View style={styles.infoRow}>
                <View style={styles.textContainer}>
                    {!!statusLabel && (
                        <View style={isVerified ? styles.verifiedStatus : styles.notVerifiedStatus}>
                            <Typography
                                text={statusLabel}
                                variant="subtitle_10_400"
                                style={isVerified ? styles.verifiedStatusText : styles.notVerifiedStatusText}
                            />
                        </View>
                    )}
                    <Typography text={name} variant="h3" style={styles.name} />
                    {!!details && <Typography text={details} variant="body_400" style={styles.details} />}
                </View>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={onAvatarPress}
                    disabled={!onAvatarPress}
                    activeOpacity={0.85}
                >
                    <Avatar size={72} avatarUrl={avatarUrl} fullname={name} />
                    {!!galleryBadgeText && (
                        <View style={styles.galleryBadge}>
                            <Typography text={galleryBadgeText} variant="subtitle_10_400" style={styles.galleryBadgeText} />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
            {hasLinks && (
                <TouchableOpacity onPress={onLinksPress} style={styles.linksButton}>
                    <Typography text={t('publicProfile.links')} variant="body_500" style={styles.linksText} />
                </TouchableOpacity>
            )}
        </View>
    );
};
