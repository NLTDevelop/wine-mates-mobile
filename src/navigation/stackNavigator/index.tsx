import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { SplashView } from '../../modules/launchApp/ui/SplashView';
import { WelcomeView } from '../../modules/launchApp/ui/WelcomeView';
import { SignInView } from '../../modules/authentication/ui/SignInView';
import { ForgotPasswordView } from '../../modules/authentication/ui/ForgotPasswordView';
import { OTPView } from '../../modules/authentication/ui/OTPView';
import { CreateNewPasswordView } from '../../modules/authentication/ui/CreateNewPasswordView';

const Stack = createStackNavigator();

export const MainStackNavigator = observer(() => {
    return (<Stack.Navigator initialRouteName="SplashView" screenOptions={{ headerShown: false }} detachInactiveScreens={false}>
        <Stack.Screen name="SplashView" component={SplashView} />
        <Stack.Screen name="WelcomeView" component={WelcomeView} />
        <Stack.Screen name="SignInView" component={SignInView} />
        <Stack.Screen name="ForgotPasswordView" component={ForgotPasswordView} />
        <Stack.Screen name="OTPView" component={OTPView} />
        <Stack.Screen name="CreateNewPasswordView" component={CreateNewPasswordView} />
    </Stack.Navigator>
    );
});
