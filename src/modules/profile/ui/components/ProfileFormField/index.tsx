import { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    label: string;
    children: ReactNode;
}

export const ProfileFormField = ({ label, children }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography text={label} variant="body_500" style={styles.label} />
            {children}
        </View>
    );
};
