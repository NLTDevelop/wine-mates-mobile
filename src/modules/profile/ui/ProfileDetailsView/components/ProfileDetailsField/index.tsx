import { useMemo, memo, ReactNode } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    text: string;
    isPlaceholder: boolean;
    leftIcon?: ReactNode;
}

const ProfileDetailsFieldComponent = ({ text, isPlaceholder, leftIcon }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Typography text={text} variant="h6" style={isPlaceholder ? styles.placeholderText : styles.fieldText} />
        </View>
    );
};

export const ProfileDetailsField = memo(ProfileDetailsFieldComponent);
