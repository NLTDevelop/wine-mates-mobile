import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';

interface IRoute {
    key: 'created' | 'saved' | 'applied';
    title: string;
}

interface IProps {
    t: ILocalization['t'];
}

type Navigation = NativeStackNavigationProp<EventStackParamList>;

export const useEventListView = ({ t }: IProps) => {
    const navigation = useNavigation<Navigation>();
    const [screenIndex, setScreenIndex] = useState(0);

    const routes: IRoute[] = [
        { key: 'created', title: t('event.created') },
        { key: 'saved', title: t('event.saved') },
        { key: 'applied', title: t('event.applied') },
    ];

    const onIndexChange = useCallback((index: number) => {
        setScreenIndex(index);
    }, []);

    const onReadMorePress = useCallback((eventId: number) => {
        navigation.navigate('EventDetailsView', { eventId });
    }, [navigation]);

    return {
        screenIndex,
        routes,
        onIndexChange,
        onReadMorePress,
    };
};
