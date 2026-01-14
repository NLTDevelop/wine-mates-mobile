import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedView } from '@/modules/feed/ui/FeedView';

const Stack = createNativeStackNavigator();

export const FeedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FeedView" component={FeedView} />
  </Stack.Navigator>
);
