import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScannerView } from '@/modules/scanner/ui/ScannerView';

const Stack = createNativeStackNavigator();

export const ScannerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ScannerView" component={ScannerView} />
  </Stack.Navigator>
);
