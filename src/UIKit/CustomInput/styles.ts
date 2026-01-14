import { StyleSheet } from "react-native";
import { scaleFontSize, scaleHorizontal, scaleVertical } from "@/utils";
import { IColors } from "@/UIProvider/theme/IColors";

export const getStyles = (colors: IColors, isFocused: boolean) => (
    StyleSheet.create({
        container: {
            marginBottom: scaleVertical(16),
        },
        label: {
            marginBottom: scaleVertical(4),
        },
        inputContainer: {
            minHeight: scaleVertical(48),
            paddingVertical: 0,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isFocused ? colors.border_strong : colors.border,
            borderRadius: 12,
            flexDirection: 'row',
        },
        input: {
            flex: 1,
            fontFamily: 'VisueltPro-Regular',
            height: "100%",
            paddingHorizontal: scaleHorizontal(16),
            fontSize: scaleFontSize(16),
            paddingVertical: 0,
            color: colors.text,
        },
        inputMultiline:{
            textAlignVertical: 'top',
            paddingVertical: scaleVertical(8),
        },
        iconContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            height: scaleVertical(36),
            width: scaleHorizontal(36),
        },
        inputError: {
            borderColor: colors.error,
        },
        errorText: {
            color: colors.error,
            marginTop: scaleVertical(4),
        },
    }));
