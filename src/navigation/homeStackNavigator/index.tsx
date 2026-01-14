import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeView } from '@/modules/home/ui/HomeView';

const Stack = createNativeStackNavigator();

export const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeView" component={HomeView} />
  </Stack.Navigator>
);
