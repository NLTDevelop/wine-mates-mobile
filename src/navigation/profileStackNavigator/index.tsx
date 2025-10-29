import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PersonalProfileView } from '@/modules/personalProfile/ui/PersonalProfileView';

const Stack = createNativeStackNavigator();

export const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PersonalProfileView" component={PersonalProfileView} />
  </Stack.Navigator>
);
