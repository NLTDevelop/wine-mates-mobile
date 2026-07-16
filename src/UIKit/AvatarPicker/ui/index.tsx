import { useMemo } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';

interface IProps {
    size: number;
    avatarUrl: string | null;
    fullname: string;
    isEditing: boolean;
    selectedImageUri: string | null;
    isMarkedForDeletion?: boolean;
    onPress: () => void;
    onRemove: () => void;
}

export const AvatarPicker = ({
    size,
    avatarUrl,
    fullname,
    isEditing,
    selectedImageUri,
    isMarkedForDeletion = false,
    onPress,
    onRemove,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size), [colors, size]);

    const onAvatarPress = () => {
        if (!isEditing) return;
        onPress();
    };

    const displayUri = selectedImageUri || avatarUrl;
    const normalizedDisplayUri =
        displayUri &&
        !displayUri.startsWith('http') &&
        !displayUri.startsWith('file://') &&
        !displayUri.startsWith('content://')
            ? `file://${displayUri}`
            : displayUri;
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
            <TouchableOpacity disabled={!isEditing} onPress={onAvatarPress} style={styles.container}>
                {displayUri && !isMarkedForDeletion ? (
                    <Image source={{ uri: normalizedDisplayUri || undefined }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        {isEditing ? (
                            <PlusIcon width={24} height={24} color={colors.primary} />
                        ) : (
                            <Typography text={initials} variant="h3" style={styles.initials} />
                        )}
                    </View>
                )}
            </TouchableOpacity>
            {isEditing && displayUri && !isMarkedForDeletion && (
                <TouchableOpacity onPress={onDeletePress} style={styles.deleteBadge}>
                    <CrossIcon color={colors.text} width={12} height={12} />
                </TouchableOpacity>
            )}
        </>
    );
};
