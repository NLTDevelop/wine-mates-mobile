import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { SplashView } from '../../modules/launchApp/ui/SplashView';

const Stack = createStackNavigator();

export const MainStackNavigator = observer(() => {
    return (<Stack.Navigator initialRouteName="SplashView" screenOptions={{ headerShown: false }} detachInactiveScreens={false}>
        <Stack.Screen name="SplashView" component={SplashView} />
    </Stack.Navigator>
    );
});
