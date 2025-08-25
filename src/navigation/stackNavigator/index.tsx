import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';

const Stack = createStackNavigator();

export const MainStackNavigator = observer(() => {
    return (<Stack.Navigator initialRouteName="SplashView" screenOptions={{ headerShown: false }} detachInactiveScreens={false}>
        {/* {BaseStackNavigator}
        {CaaStackNavigator}
        {LMSStackNavigator}
        {ChatsStackNavigator} */}
    </Stack.Navigator>
    );
});
