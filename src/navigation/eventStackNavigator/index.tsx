import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventMapView } from '@/modules/event/ui/EventView';
import { EventDetails } from '@/modules/event/ui/EventDetails';
import { AddEventView } from '@/modules/event/ui/AddEventView';
import { AddWineSetView } from '@/modules/event/ui/AddWineSetView';
import { EditEventWineView } from '@/modules/event/ui/EditEventWineView';
import { LocationPickerView } from '@/modules/event/ui/LocationPickerView';
import { StackWrapper } from '@/navigation/components/StackWrapper/ui';
import { EventStackParamList } from './types';

const Stack = createNativeStackNavigator<EventStackParamList>();

export const EventStack = () => (
  <StackWrapper>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventMapView" component={EventMapView} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
      <Stack.Screen name="AddEventView" component={AddEventView} />
      <Stack.Screen name="AddWineSetView" component={AddWineSetView} />
      <Stack.Screen name="EditEventWineView" component={EditEventWineView} />
      <Stack.Screen name="LocationPickerView" component={LocationPickerView} />
    </Stack.Navigator>
  </StackWrapper>
);
