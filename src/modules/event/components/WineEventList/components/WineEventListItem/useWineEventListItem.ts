import { useCallback, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { formatEventDate } from '@/utils';

interface IUseWineEventListItemProps {
    eventId: number;
    eventDate: string;
    onReadMorePress?: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
}

type NavigationProp = NativeStackNavigationProp<EventStackParamList>;

export const useWineEventListItem = ({
    eventId,
    eventDate,
    onReadMorePress,
    onFavoritePress
}: IUseWineEventListItemProps) => {
    const navigation = useNavigation<NavigationProp>();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { month, day } = useMemo(() => formatEventDate(eventDate), [eventDate]);

    const onCardPress = useCallback(() => {
        setIsModalVisible(true);
    }, []);

    const onBookingPress = useCallback(() => {
        setIsModalVisible(false);
        navigation.navigate('EventDetails', { eventId });
        onReadMorePress?.(eventId);
    }, [eventId, navigation, onReadMorePress]);

    const onCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const onFavoritePressHandler = useCallback(() => {
        onFavoritePress?.(eventId);
    }, [eventId, onFavoritePress]);

    const onReadMorePressHandler = useCallback(() => {
        onReadMorePress?.(eventId);
    }, [eventId, onReadMorePress]);

    return {
        month,
        day,
        isModalVisible,
        onCardPress,
        onBookingPress,
        onCloseModal,
        onReadMorePress: onReadMorePressHandler,
        onFavoritePress: onFavoritePressHandler,
    };
};
