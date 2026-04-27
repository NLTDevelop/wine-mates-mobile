import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventMapView } from '@/modules/event/ui/EventMapView';
import { EventDetailsView } from '@/modules/event/ui/EventDetailsView';
import { EventFiltersView } from '@/modules/event/ui/EventFiltersView';
import { StackWrapper } from '@/navigation/components/StackWrapper/ui';
import { EventStackParamList } from './types';

const Stack = createNativeStackNavigator<EventStackParamList>();

export const EventStack = () => (
  <StackWrapper>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventMapView" component={EventMapView} />
      <Stack.Screen name="EventDetailsView" component={EventDetailsView} />
      <Stack.Screen name="EventFiltersView" component={EventFiltersView}  options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
  </StackWrapper>
);
