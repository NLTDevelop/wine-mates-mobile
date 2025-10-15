import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UIProvider, useUiContext } from './UIProvider';
import { RootNavigator } from './navigation/rootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastOverlay } from './libs/toast/ui/ToastOverlay';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React from 'react';
import { StatusBar } from 'react-native';

export const App = () => (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <UIProvider>
            <ThemedApp />
        </UIProvider>
    </GestureHandlerRootView>
);

const ThemedApp = () => {
    const { colors, theme } = useUiContext();

    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
            <BottomSheetModalProvider>
                <RootNavigator />
                <ToastOverlay />
                <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'dark-content'} backgroundColor={colors.background}/>
            </BottomSheetModalProvider>
        </SafeAreaProvider>
    );
};
