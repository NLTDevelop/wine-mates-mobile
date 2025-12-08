import { StyleSheet } from "react-native";
import { scaleHorizontal, scaleVertical } from "@/utils";
import { IColors } from "@/UIProvider/theme/IColors";

export const getStyles = (colors: IColors, isCentered: boolean, withRightComponent: boolean) => {
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
            left: isCentered ? 0 : scaleHorizontal(72),
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: isCentered ? 'center' : 'flex-start',
            pointerEvents: 'none',
        },
        title: {
            maxWidth: withRightComponent ? scaleHorizontal(228) : scaleHorizontal(246),
            flexShrink: 1,
        },
        empty: {
            width: scaleVertical(40),
            height: scaleVertical(40),
        },
    });
    return styles;
};
