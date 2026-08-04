import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    title: string;
    subtitle: string;
    onPress: () => void;
}

export const WineSearchResultRow = ({ title, subtitle, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Typography variant="h6" text={title} style={styles.title} />
            {!!subtitle && <Typography variant="body_400" text={subtitle} style={styles.subtitle} />}
        </TouchableOpacity>
    );
};
