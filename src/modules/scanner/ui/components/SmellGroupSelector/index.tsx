import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { NextLongArrowIcon } from '@/assets/icons/NextLongArrowIcon';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';
import { IWineSmell } from '@/entities/wine/types/IWineSmell';

interface IProps {
    data: IWineSmell[];
    isOpened: boolean;
    selectedIndex: number;
    onPress: () => void;
    handleLeftPress: () => void;
    handleRightPress: () => void;
}

export const SmellGroupSelector = ({ data, selectedIndex, isOpened, onPress, handleLeftPress, handleRightPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, data[selectedIndex].colorHex), [colors, data, selectedIndex]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleLeftPress}>
                <ArrowIcon width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainContainer} onPress={onPress}>
                <Typography text={data[selectedIndex].nameEn || data[selectedIndex].name} variant="h6" />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRightPress}>
                <NextLongArrowIcon width={20} height={20} color={colors.icon} />
            </TouchableOpacity>
        </View>
    );
};
