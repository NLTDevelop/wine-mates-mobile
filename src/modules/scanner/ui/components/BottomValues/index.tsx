import { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';

interface IProps {
    leftValue: string;
    rightValue: string;
    middleValue?: string;
    isTriple?: boolean;
    containerStyle?: ViewStyle;
}

export const BottomValues = ({ leftValue, rightValue, middleValue, isTriple = false, containerStyle }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
            <View style={[styles.container, containerStyle]}>
                <View style={[styles.valueItem, styles.left]}>
                    <Typography text={leftValue} variant="body_500" style={[styles.text, styles.textLeft]} />
                </View>
                {isTriple && <View style={[styles.valueItem, styles.center]}>
                    <Typography
                        text={middleValue}
                        variant="body_500"
                        style={[styles.text, styles.textCenter]}
                    />
                </View>}
                <View style={[styles.valueItem, styles.right]}>
                    <Typography
                        text={rightValue}
                        variant="body_500"
                        style={[styles.text, styles.textRight]}
                    />
                </View>
            </View>
    );
};
