import { useMemo } from 'react';
import { getStyles } from './styles';
import { GuestTabsView } from './components/guestsTabsView';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { GuestItemView } from './components/guestItemView';
import { useUiContext } from '@/UIProvider';
import { IPreparedEventGuest } from '@/modules/event/ui/EventDetailsView/types/IPreparedEventGuest';
import { useEventGuestsTab } from './presenters/useEventGuestsTab';
import { EmptyListView } from '@/UIKit/EmptyListView';

interface IProps {
    eventId: number;
    requiresConfirmation: boolean;
}

export const GuestsTab = ({ eventId, requiresConfirmation }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { eventGuests, errorMessage, isError, isLoading, onLoadMore, tabs } = useEventGuestsTab({
        eventId,
        requiresConfirmation,
    });

    const renderItem = ({ item }: { item: IPreparedEventGuest }) => {
        return (
            <GuestItemView
                fullName={item.fullName}
                avatarUrl={item.avatarUrl}
                ageText={item.ageText}
                primaryAction={item.primaryAction}
                secondaryAction={item.secondaryAction}
            />
        );
    };

    const keyExtractor = (item: IPreparedEventGuest) => {
        return `${item.id}`;
    };

    const renderItemSeparator = () => {
        return <View style={styles.itemSeparator} />;
    };

    if (isLoading) {
        return (
            <>
                {requiresConfirmation ? <GuestTabsView tabs={tabs} /> : null}
                <View style={styles.stateContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </>
        );
    }

    if (!eventGuests.length) {
        return (
            <>
                {requiresConfirmation ? <GuestTabsView tabs={tabs} /> : null}
                <View style={styles.stateContainer}>
                    <EmptyListView
                        isNothingFound={isError && !errorMessage}
                        text={errorMessage || t('eventGuests.emptyList')}
                    />
                </View>
            </>
        );
    }

    return (
        <>
            {requiresConfirmation ? <GuestTabsView tabs={tabs} /> : null}
            <FlatList
                data={eventGuests}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ItemSeparatorComponent={renderItemSeparator}
                onEndReached={onLoadMore}
                contentContainerStyle={styles.flatlist}
            />
        </>
    );
};
