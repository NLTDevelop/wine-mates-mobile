import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { EventCard } from '@/UIKit/EventCard';
import { IEvent } from '@/entities/events/types/IEvent';

interface IProps {
    events: IEvent[];
    onReadMorePress: (eventId: number) => void;
    onFavoritePress: (eventId: number) => void;
    onEditPress: (eventId: number) => void;
    onCardPress: (eventId: number) => void;
}

export const WineEventList = ({
    events,
    onReadMorePress,
    onFavoritePress,
    onEditPress,
    onCardPress,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const renderItem = useCallback<ListRenderItem<IEvent>>(({ item }) => (
        <EventCard
            event={item}
            isSelected={false}
            onReadMorePress={onReadMorePress}
            onFavoritePress={onFavoritePress}
            onEditPress={onEditPress}
            onCardPress={onCardPress}
        />
    ), [onCardPress, onEditPress, onFavoritePress, onReadMorePress]);

    const keyExtractor = useCallback((item: IEvent) => item.id.toString(), []);

    return (
        <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
        />
    );
};
