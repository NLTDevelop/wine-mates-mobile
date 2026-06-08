import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Avatar } from '@/UIKit/Avatar';
import { Typography } from '@/UIKit/Typography';
import { IEventParticipantsPreviewData } from '@/modules/event/types/IEventParticipantPreviewData';
import { getStyles } from './styles';

interface IProps {
    data: IEventParticipantsPreviewData;
}

export const EventParticipantsPreview = ({ data }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    if (!data.isNeedShow) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatarsContainer}>
                {data.firstParticipant && (
                    <Avatar
                        size={24}
                        avatarUrl={data.firstParticipant.avatarUrl}
                        fullname={data.firstParticipant.fullName}
                    />
                )}
                {data.secondParticipant && (
                    <Avatar
                        size={24}
                        avatarUrl={data.secondParticipant.avatarUrl}
                        fullname={data.secondParticipant.fullName}
                        containerStyle={styles.overlappedAvatar}
                    />
                )}
                {data.thirdParticipant && (
                    <Avatar
                        size={24}
                        avatarUrl={data.thirdParticipant.avatarUrl}
                        fullname={data.thirdParticipant.fullName}
                        containerStyle={styles.overlappedAvatar}
                    />
                )}
            </View>
            {!!data.additionalCountText && (
                <Typography text={data.additionalCountText} variant="body_400" style={styles.interestingText} />
            )}
        </View>
    );
};
