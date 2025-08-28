import { StyleSheet } from "react-native";
import { scaleHorizontal, scaleVertical } from "../../utils";
import { IColors } from "../../UIProvider/theme/IColors";

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            width: '100%',
            height: scaleVertical(56),
            paddingHorizontal: scaleHorizontal(16),
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: scaleVertical(16),
        },
        button: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: scaleVertical(22),
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        titleContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
        },
        empty: {
            width: scaleVertical(40),
            height: scaleVertical(40),
        },
    });
    return styles;
};
