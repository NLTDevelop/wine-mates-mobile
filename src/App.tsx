import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UIProvider, useUiContext } from './UIProvider';
import { RootNavigator } from './navigation/rootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const App = () => (
    <UIProvider>
        <ThemedApp />
    </UIProvider>
);

const ThemedApp = () => {
    const { colors } = useUiContext();

    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
            <GestureHandlerRootView>
                <RootNavigator />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
};
