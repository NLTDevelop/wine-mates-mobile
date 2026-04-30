import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UIProvider, useUiContext } from './UIProvider';
import { RootNavigator } from './navigation/rootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastOverlay } from './libs/toast/ui/ToastOverlay';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'react-native';
import { useGoogleConfig } from './hooks/useGoogleConfig';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { clearTasteCharacteristicsCache } from './libs/storage/cacheUtils';

export const App = () => (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <UIProvider>
            <ThemedApp />
        </UIProvider>
    </GestureHandlerRootView>
);

const ThemedApp = () => {
    const { colors, theme } = useUiContext();
    useGoogleConfig();

    useEffect(() => {
        clearTasteCharacteristicsCache();
    }, []);

    return (
        <KeyboardProvider>
            <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
                <BottomSheetModalProvider>
                    <RootNavigator />
                    <StatusBar
                        translucent
                        barStyle={theme === 'light' ? 'dark-content' : 'dark-content'}
                    />
                </BottomSheetModalProvider>
                <ToastOverlay />
            </SafeAreaProvider>
        </KeyboardProvider>
    );
};
