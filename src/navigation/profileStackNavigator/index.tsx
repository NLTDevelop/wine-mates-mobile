import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileView } from '@/modules/profile/ui/ProfileView';
import { SettingsView } from '@/modules/settings/ui/SettingsView';
import { WineAndStylesView } from '@/modules/wineAndStyles/ui/WineAndStylesView';
import { FAQView } from '@/modules/settings/ui/FAQView';

const Stack = createNativeStackNavigator();

export const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileView" component={ProfileView} />
    <Stack.Screen name="SettingsView" component={SettingsView} />
    <Stack.Screen name="FAQView" component={FAQView} />
    <Stack.Screen name="WineAndStylesView" component={WineAndStylesView} />
  </Stack.Navigator>
);
