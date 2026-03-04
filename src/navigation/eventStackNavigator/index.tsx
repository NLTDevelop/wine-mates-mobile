import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventMapView } from '@/modules/event/ui';

const Stack = createNativeStackNavigator();

export const EventStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EventMapView" component={EventMapView} />
  </Stack.Navigator>
);
