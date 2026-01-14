import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ArrowIcon } from '@assets/icons/ArrowIcon';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { IWineSmell } from '@/entities/wine/types/IWineSmell';
import { getContrastColor } from '@/utils';

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
    const styles = useMemo(() => getStyles(colors), [colors]);
    const totalGroups = data.length;
    const hasGroups = totalGroups > 0;
    const prevIndex = hasGroups ? (selectedIndex === 0 ? totalGroups - 1 : selectedIndex - 1) : 0;
    const nextIndex = hasGroups ? (selectedIndex === totalGroups - 1 ? 0 : selectedIndex + 1) : 0;
    const currentColor = hasGroups ? data[selectedIndex].colorHex : colors.background;
    const prevColor = hasGroups ? data[prevIndex].colorHex : colors.background;
    const nextColor = hasGroups ? data[nextIndex].colorHex : colors.background;
    const currentTextColor = getContrastColor(currentColor);
    const prevTextColor = getContrastColor(prevColor);
    const nextTextColor = getContrastColor(nextColor);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, { backgroundColor: prevColor }]} onPress={handleLeftPress}>
                <ArrowIcon width={20} height={20} color={prevTextColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mainContainer, { backgroundColor: currentColor }]} onPress={onPress}>
                <Typography text={data[selectedIndex].name} variant="h6" style={{ color: currentTextColor }}/>
                <ArrowDownIcon rotate={isOpened ? 180 : 0} color={currentTextColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: nextColor }]} onPress={handleRightPress}>
                <NextLongArrowIcon width={20} height={20} color={nextTextColor} />
            </TouchableOpacity>
        </View>
    );
};
