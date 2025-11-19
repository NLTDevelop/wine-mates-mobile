import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { NextLongArrowIcon } from '@/assets/icons/NextLongArrowIcon';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';

export interface ISelectedItem {
    id: number;
    value: string;
    color: string;
}

interface IProps {
    data: ISelectedItem[];
    isOpened: boolean;
    onPress: () => void;
    handleLeftPress: () => void;
    handleRightPress: () => void;
}

export const SmellGroupSelector = ({ data, isOpened, onPress, handleLeftPress, handleRightPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, data[0].color), [colors, data]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleLeftPress}>
                <ArrowIcon width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainContainer} onPress={onPress}>
                <Typography text={data[0].value} variant="h6" />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRightPress}>
                <NextLongArrowIcon width={20} height={20} color={colors.icon} />
            </TouchableOpacity>
        </View>
    );
};
