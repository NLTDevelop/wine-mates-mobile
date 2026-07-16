import { Avatar } from '@/UIKit/Avatar';
import { useUiContext } from '@/UIProvider';
import { scaleHorizontal } from '@/utils';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { Typography } from '@/UIKit/Typography';
import { WineLoverIcon } from '@assets/icons/WineLoverIcon';
import { WineExpertIcon } from '@assets/icons/WineExpertIcon';
import { WinemakerIcon } from '@assets/icons/WinemakerIcon';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

const EXPERTISE_SIZE = scaleHorizontal(24);

interface IProps {
    avatarUrl: string | null;
    fullName: string;
    expertiseLabel: string;
    expertiseLevel: WineExperienceLevelEnum;
}

const ProfileAvatarExpertiseLevelComponent = ({ avatarUrl, fullName, expertiseLabel, expertiseLevel }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Avatar size={120} avatarUrl={avatarUrl} fullname={fullName} />
            <View style={styles.roleContainer}>
                <Typography text={expertiseLabel} variant="body_500" style={styles.roleText} />
                {expertiseLevel === WineExperienceLevelEnum.LOVER && (
                    <WineLoverIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />
                )}
                {expertiseLevel === WineExperienceLevelEnum.EXPERT && (
                    <WineExpertIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />
                )}
                {expertiseLevel === WineExperienceLevelEnum.CREATOR && (
                    <WinemakerIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />
                )}
            </View>
        </View>
    );
};

export const ProfileAvatarExpertiseLevel = memo(ProfileAvatarExpertiseLevelComponent);
