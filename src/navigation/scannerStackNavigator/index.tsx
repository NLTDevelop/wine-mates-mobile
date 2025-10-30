import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScannerView } from '@/modules/scanner/ui/ScannerView';
import { AddWineView } from '@/modules/scanner/ui/AddWineView';

const Stack = createNativeStackNavigator();

export const ScannerStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ScannerView" component={ScannerView} />
        <Stack.Screen name="AddWineView" component={AddWineView} />
    </Stack.Navigator>
);
