import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeView } from '@/modules/home/ui/HomeView';
import { StackWrapper } from '@/navigation/components/StackWrapper/ui';
import { ScreenHeader } from '@/UIKit/ScreenHeader';

const Stack = createNativeStackNavigator();

export const HomeStack = () => (
  <StackWrapper stackHeader={<ScreenHeader />}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeView" component={HomeView} />
    </Stack.Navigator>
  </StackWrapper>
);
