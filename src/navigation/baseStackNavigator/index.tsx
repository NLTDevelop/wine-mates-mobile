import { observer } from 'mobx-react-lite';
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
import { WineLookView } from '@/modules/scanner/ui/WineLookView';
import { WineSmellView } from '@/modules/scanner/ui/WineSmellView';
import { WineTasteView } from '@/modules/scanner/ui/WineTasteView';
import { WineTasteCharacteristicsView } from '@/modules/scanner/ui/WineTasteCharacteristicsView';
import { WineReviewView } from '@/modules/scanner/ui/WineReviewView';
import { WineReviewResultView } from '@/modules/scanner/ui/WineReviewResultView';
import { SavedWinesView } from '@/modules/wine/ui/SavedWinesView';
import { FavoriteWineListView } from '@/modules/wine/ui/FavoriteWineListView';
import { WineDetailsView } from '@/modules/wine/ui/WineDetailsView';
import { DeleteAccountView } from '@/modules/settings/ui/DeleteAccountView';
import { ProfileSettingsView } from '@/modules/settings/ui/ProfileSettingsView';
import { AvatarCameraView } from '@/UIKit/AvatarPicker/ui/AvatarCameraView';

const Stack = createNativeStackNavigator();

export const MainStackNavigator = observer(() => {
    return (
        <Stack.Navigator initialRouteName="SplashView" screenOptions={{ headerShown: false }}>
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
            <Stack.Screen name="WineDetailsView" component={WineDetailsView} />
            <Stack.Screen name="WineLookView" component={WineLookView} options={{ gestureEnabled: false }} />
            <Stack.Screen name="WineSmellView" component={WineSmellView} />
            <Stack.Screen name="WineTasteView" component={WineTasteView} />
            <Stack.Screen
                name="WineTasteCharacteristicsView"
                component={WineTasteCharacteristicsView}
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="WineReviewView" component={WineReviewView} options={{ gestureEnabled: false }} />
            <Stack.Screen name="WineReviewResultView" component={WineReviewResultView} />
            <Stack.Screen name="SavedWinesView" component={SavedWinesView} />
            <Stack.Screen name="FavoriteWineListView" component={FavoriteWineListView} />
            <Stack.Screen name="DeleteAccountView" component={DeleteAccountView} />
            <Stack.Screen name="ProfileSettingsView" component={ProfileSettingsView} />
            <Stack.Screen name="AvatarCameraView" component={AvatarCameraView} />
        </Stack.Navigator>
    );
});
