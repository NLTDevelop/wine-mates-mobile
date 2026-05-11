import { observer } from 'mobx-react-lite';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { MainStackNavigator } from '@/navigation/baseStackNavigator';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useUiContext } from '@/UIProvider';
import { Logger } from '@/UIKit/Logger/ui/Logger';
import { appStateModel } from '@/entities/appState/AppStateModel';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { linking, type RootDeepLinkParamList } from './linking';

export const navigationRef = createNavigationContainerRef<RootDeepLinkParamList>();

export const RootNavigator = observer(() => {
    const { colors, theme, fonts } = useUiContext();
    const { handleRetry } = useNetworkStatus();

    return (
        <NavigationContainer ref={navigationRef} linking={linking} theme={{ colors, dark: theme === 'dark', fonts }}>
            <WithErrorHandler error={appStateModel.network ? null : ErrorTypeEnum.NO_INTERNET} onRetry={handleRetry}>
                <MainStackNavigator />
            </WithErrorHandler>
            <Logger />
        </NavigationContainer>
    );
});
