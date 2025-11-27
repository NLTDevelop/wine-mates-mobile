import { useMemo } from 'react';
import { ViewStyle, View, Keyboard, Pressable, ScrollView, RefreshControlProps } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { Gradient } from '../Gradient';
import { KeyboardAwareScrollView, KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { isIOS, scaleVertical } from '@/utils';

interface IProps {
    edges?: Edge[];
    children?: React.ReactNode;
    scrollEnabled?: boolean;
    containerStyle?: ViewStyle;
    contentContainerStyle?: ViewStyle;
    headerComponent?: React.ReactNode;
    withGradient?: boolean;
    isKeyboardAvoiding?: boolean;
    refreshControl?: React.ReactElement<RefreshControlProps>;
}

export const ScreenContainer = ({ headerComponent, edges, children, scrollEnabled = false, containerStyle, contentContainerStyle,
    withGradient = false, isKeyboardAvoiding = false, refreshControl,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const safeAreaInsets = useSafeAreaInsets();
    const bottomOffset = useMemo(() => (isIOS ? scaleVertical(24) : 0), []);

    const edgesStyle = useMemo(() => {
        const result: any = {};
        if (!edges) {
            return { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom };
        }
        if (edges?.includes('top')) {
            result.paddingTop = safeAreaInsets.top;
        }
        if (edges?.includes('bottom')) {
            result.paddingBottom = safeAreaInsets.bottom;
        }
        if (edges?.includes('left')) {
            result.paddingLeft = safeAreaInsets.left;
        }
        if (edges?.includes('right')) {
            result.paddingRight = safeAreaInsets.right;
        }
        return result;
    }, [safeAreaInsets, edges]);

    return (
        <View style={[styles.mainContainer, edgesStyle]}>
            {withGradient && <Gradient />}
            {!!headerComponent && headerComponent}

            {isKeyboardAvoiding ? (
                <>
                    {scrollEnabled ? (
                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled
                            contentContainerStyle={[styles.contentContainerStyle, contentContainerStyle]}
                            style={styles.scroll}
                            bottomOffset={bottomOffset}
                            refreshControl={refreshControl}
                            bounces={!!refreshControl}
                        >
                            <Pressable style={styles.container} onPress={Keyboard.dismiss}>
                                {children}
                            </Pressable>
                        </KeyboardAwareScrollView>
                    ) : (
                        <KeyboardAvoidingView style={[styles.container, containerStyle]}>
                            <Pressable style={styles.container} onPress={Keyboard.dismiss}>
                                {children}
                            </Pressable>
                        </KeyboardAvoidingView>
                    )}
                </>
            ) : (
                <>
                    {scrollEnabled ? (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled
                            contentContainerStyle={[styles.contentContainerStyle, contentContainerStyle]}
                            style={styles.scroll}
                            refreshControl={refreshControl}
                            bounces={!!refreshControl}
                        >
                            {children}
                        </ScrollView>
                    ) : (
                        <View style={[styles.container, containerStyle]}>{children}</View>
                    )}
                </>
            )}
        </View>
    );
};
