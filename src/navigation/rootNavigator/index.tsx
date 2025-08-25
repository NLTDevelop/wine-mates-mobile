import { NavigationContainer } from '@react-navigation/native';
import { MainStackNavigator } from '../stackNavigator';
import { useUiContext } from '../../UIProvider';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { createNavigationContainerRef } from '@react-navigation/native';
import { Logger } from '../../UIKit/Logger/ui/Logger';
import { observer } from 'mobx-react';

type RootStackParamList = {
    PublicProfileView: { id: string };
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const RootNavigator = observer(() => {
    const { colors, theme, fonts } = useUiContext();
    useNetworkStatus();

    return (
        <NavigationContainer ref={navigationRef} theme={{ colors, dark: theme === 'dark', fonts }}>
            <MainStackNavigator />
            <Logger />
        </NavigationContainer>
    );
});
