import { useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { EventCard } from '@/UIKit/EventCard';
import { IEvent } from '@/entities/events/types/IEvent';

interface IProps {
    events: IEvent[];
    selectedEventId: number | null;
    onReadMorePress: (eventId: number) => void;
    onFavoritePress: (eventId: number) => void;
}

export const WineEventList = ({
    events,
    selectedEventId,
    onReadMorePress,
    onFavoritePress
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const renderItem: ListRenderItem<IEvent> = ({ item }) => (
        <EventCard
            event={item}
            isSelected={selectedEventId === item.id}
            onReadMorePress={onReadMorePress}
            onFavoritePress={onFavoritePress}
        />
    );

    const keyExtractor = (item: IEvent) => item.id.toString();

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
