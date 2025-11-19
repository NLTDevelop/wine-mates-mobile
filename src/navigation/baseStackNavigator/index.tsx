import { observer } from 'mobx-react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashView } from '@/modules/launchApp/ui/SplashView';
import { WelcomeView } from '@/modules/launchApp/ui/WelcomeView';
import { SignInView } from '@/modules/authentication/ui/SignInView';
import { ForgotPasswordView } from '@/modules/authentication/ui/ForgotPasswordView';
import { OTPView } from '@/modules/authentication/ui/OTPView';
import { CreateNewPasswordView } from '@/modules/authentication/ui/CreateNewPasswordView';
import { MyLevelView } from '@/modules/registration/ui/MyLevelView';
import { RegistrationView } from '@/modules/registration/ui/RegistrationView';
import { TabNavigator } from '../tabNavigator';
import { PersonalDetailsView } from '@/modules/registration/ui/PersonalDetailsView';
import { CreatePasswordView } from '@/modules/registration/ui/CreatePasswordView';
import { ScanResultView } from '@/modules/scanner/ui/ScanResultView';
import { WineLookView } from '@/modules/scanner/ui/WineLookView';
import { WineSmellView } from '@/modules/scanner/ui/WineSmellView';

const Stack = createNativeStackNavigator();

export const MainStackNavigator = observer(() => {
    return (<Stack.Navigator initialRouteName="SplashView" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashView" component={SplashView} />
        <Stack.Screen name="WelcomeView" component={WelcomeView} />
        <Stack.Screen name="SignInView" component={SignInView} />
        <Stack.Screen name="ForgotPasswordView" component={ForgotPasswordView} />
        <Stack.Screen name="OTPView" component={OTPView} />
        <Stack.Screen name="CreateNewPasswordView" component={CreateNewPasswordView} />
        <Stack.Screen name="MyLevelView" component={MyLevelView} />
        <Stack.Screen name="RegistrationView" component={RegistrationView} />
        <Stack.Screen name="PersonalDetailsView" component={PersonalDetailsView} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="CreatePasswordView" component={CreatePasswordView} />
        <Stack.Screen name="ScanResultView" component={ScanResultView} />
        <Stack.Screen name="WineLookView" component={WineLookView} options={{gestureEnabled: false}}/>
        <Stack.Screen name="WineSmellView" component={WineSmellView} options={{gestureEnabled: false}}/>
    </Stack.Navigator>
    );
});
