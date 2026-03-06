import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';

interface IUseWineEventListItemProps {
    eventId: number;
    onReadMorePress?: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
}

type NavigationProp = NativeStackNavigationProp<EventStackParamList>;

export const useWineEventListItem = ({
    eventId,
    onReadMorePress,
    onFavoritePress
}: IUseWineEventListItemProps) => {
    const navigation = useNavigation<NavigationProp>();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onReadMorePressHandler = useCallback(() => {
        navigation.navigate('EventDetails', { eventId });
        onReadMorePress?.(eventId);
    }, [eventId, navigation, onReadMorePress]);

    const onCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const onFavoritePressHandler = useCallback(() => {
        onFavoritePress?.(eventId);
    }, [eventId, onFavoritePress]);

    return {
        isModalVisible,
        onReadMorePress: onReadMorePressHandler,
        onCloseModal,
        onFavoritePress: onFavoritePressHandler,
    };
};
