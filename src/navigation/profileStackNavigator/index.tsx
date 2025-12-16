import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileView } from '@/modules/profile/ui/ProfileView';

const Stack = createNativeStackNavigator();

export const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileView" component={ProfileView} />
  </Stack.Navigator>
);
