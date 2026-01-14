import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

export const useSavedWinesListItem = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    
    const onPress = useCallback((item: IWineListItem) => {
        navigation.navigate('WineDetailsView', {wineId: item.id});
    },[navigation]);

    return { onPress };
};
