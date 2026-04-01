import { useMemo } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';

interface IProps {
    size: number;
    avatarUrl: string | null;
    fullname: string;
    isEditing: boolean;
    selectedImageUri: string | null;
    hasAvatar: boolean;
    onPress: () => void;
    onRemove: () => void;
}

export const AvatarPicker = ({ size, avatarUrl, fullname, isEditing, selectedImageUri, hasAvatar, onPress, onRemove }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size), [colors, size]);

    const onAvatarPress = () => {
        if (!isEditing) return;
        onPress();
    };

    const displayUri = selectedImageUri || avatarUrl;
    const initials = fullname
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const onDeletePress = (e: any) => {
        e.stopPropagation();
        onRemove();
    };

    return (
        <>
            <Pressable onPress={onAvatarPress} style={styles.container}>
                {displayUri ? (
                    <FasterImageView source={{ uri: displayUri }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Typography text={initials} variant="h3" style={styles.initials} />
                    </View>
                )}
            </Pressable>
            {isEditing && hasAvatar && (
                <TouchableOpacity onPress={onDeletePress} style={styles.deleteBadge}>
                    <CrossIcon color={colors.background} width={12} height={12} />
                </TouchableOpacity>
            )}
        </>
    );
};
