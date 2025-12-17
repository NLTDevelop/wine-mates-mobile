import { ReactElement, useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';

interface IProps {
    text: string;
    icon: ReactElement;
    onPress: () => void;
}

export const ProfileListButton = ({ text, icon, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.row}>
                {icon}
                <Typography variant="h6" text={text} />
            </View>
            <NextArrowIcon color={colors.icon}/>
        </TouchableOpacity>
    );
};
