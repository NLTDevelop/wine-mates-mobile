import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileView } from '@/modules/profile/ui/ProfileView';
import { SettingsView } from '@/modules/settings/ui/SettingsView';
import { WineAndStylesView } from '@/modules/wineAndStyles/ui/WineAndStylesView';
import { FAQView } from '@/modules/settings/ui/FAQView';
import { PaymentsView } from '@/modules/payments/ui/PaymentsView';
import { CreatePaymentView } from '@/modules/payments/ui/CreatePaymentView';

const Stack = createNativeStackNavigator();

export const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileView" component={ProfileView} />
        <Stack.Screen name="SettingsView" component={SettingsView} />
        <Stack.Screen name="FAQView" component={FAQView} />
        <Stack.Screen name="WineAndStylesView" component={WineAndStylesView} />
        <Stack.Screen name="PaymentsView" component={PaymentsView} />
        <Stack.Screen name="CreatePaymentView" component={CreatePaymentView} />
    </Stack.Navigator>
);
