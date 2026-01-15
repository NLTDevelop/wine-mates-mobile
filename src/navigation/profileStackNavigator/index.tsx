import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileView } from '@/modules/profile/ui/ProfileView';
import { SettingsView } from '@/modules/settings/ui/SettingsView';
import { WineAndStylesView } from '@/modules/wineAndStyles/ui/WineAndStylesView';

const Stack = createNativeStackNavigator();

export const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileView" component={ProfileView} />
    <Stack.Screen name="SettingsView" component={SettingsView} />
    <Stack.Screen name="WineAndStylesView" component={WineAndStylesView} />
  </Stack.Navigator>
);
