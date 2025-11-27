import { memo, useMemo, useState, useCallback } from 'react';
import { DimensionValue, ViewStyle, View, LayoutChangeEvent } from 'react-native';
import { getStyle } from './styles';
import { useUiContext } from '../../UIProvider';
import { scaleVertical } from '../../utils';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { Typography } from '../Typography';

interface IProps {
    size?: number;
    avatarUrl: string | null;
    fullname: string | null;
    containerStyle?: ViewStyle;
}

const AvatarComponent = ({ containerStyle = {}, avatarUrl, fullname, size = 40 }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyle(colors), [colors]);

    const [measuredSize, setMeasuredSize] = useState<number | null>(null);
    size = scaleVertical(size);

    const initials = useMemo(() => {
        if (!fullname) return '?';
        const words = fullname.trim().split(/\s+/);
        if (words.length < 1) return '?';
        const first = words[0]?.[0]?.toUpperCase() || '';
        const second = words[1]?.[0]?.toUpperCase() || '';
        return second ? `${first}${second}` : first;
    }, [fullname]);

    const onLayout = useCallback(
        (e: LayoutChangeEvent) => {
            const { width } = e.nativeEvent.layout;
            setMeasuredSize(width);
        },
        [setMeasuredSize],
    );

    const sizeStyle = useMemo(() => ({ width: size as DimensionValue, height: size as DimensionValue }), [size]);

    const textStyle = useMemo(() => {
        const actualSize = typeof size === 'number' ? size : measuredSize;
        return actualSize ? { fontSize: actualSize / 2 } : {};
    }, [size, measuredSize]);

    return (
        <View
            onLayout={typeof size === 'string' ? onLayout : undefined}
            style={[styles.container, containerStyle, sizeStyle]}
            key={avatarUrl}
        >
            {avatarUrl ? (
                <FasterImageView
                    source={{ uri: avatarUrl, resizeMode: 'cover' }}
                    style={[styles.avatar, sizeStyle]}
                />
            ) : (
                <Typography variant="body_400" text={initials} style={textStyle} />
            )}
        </View>
    );
};

export const Avatar = memo(AvatarComponent);
