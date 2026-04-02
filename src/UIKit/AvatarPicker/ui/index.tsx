import { useMemo } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { DeleteForeverIcon } from '@assets/icons/DeleteForeverIcon';
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
    isMarkedForDeletion?: boolean;
    onPress: () => void;
    onRemove: () => void;
    onCancelDeletion: () => void;
}

export const AvatarPicker = ({ size, avatarUrl, fullname, isEditing, selectedImageUri, hasAvatar, isMarkedForDeletion = false, onPress, onRemove, onCancelDeletion }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size), [colors, size]);

    const onAvatarPress = () => {
        if (!isEditing) return;
        if (isMarkedForDeletion) {
            onCancelDeletion();
        } else {
            onPress();
        }
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
                {isMarkedForDeletion && (avatarUrl || selectedImageUri) && (
                    <View style={styles.deleteOverlay}>
                        <DeleteForeverIcon width={32} height={32} color={colors.background} />
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
