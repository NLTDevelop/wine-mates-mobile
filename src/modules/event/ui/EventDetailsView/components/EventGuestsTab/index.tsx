import { useCallback, useMemo } from 'react';
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
    isEventOwner: boolean;
}

export const GuestsTab = ({ eventId, requiresConfirmation, isEventOwner }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        eventGuests,
        errorMessage,
        isError,
        isLoading,
        isRefreshing,
        onRefresh,
        onLoadMore,
        tabs,
        areStatusTabsVisible,
    } = useEventGuestsTab({
        eventId,
        requiresConfirmation,
        isEventOwner,
    });

    const renderItem = useCallback(({ item }: { item: IPreparedEventGuest }) => {
        return (
            <GuestItemView
                fullName={item.fullName}
                avatarUrl={item.avatarUrl}
                ageText={item.ageText}
                showAge={item.showAge}
                onUserPress={item.onUserPress}
                primaryAction={item.primaryAction}
                secondaryAction={item.secondaryAction}
            />
        );
    }, []);

    const keyExtractor = useCallback((item: IPreparedEventGuest) => {
        return `${item.id}`;
    }, []);

    const renderItemSeparator = useCallback(() => {
        return <View style={styles.itemSeparator} />;
    }, [styles.itemSeparator]);

    if (isLoading) {
        return (
            <>
                {areStatusTabsVisible ? <GuestTabsView tabs={tabs} /> : null}
                <View style={styles.stateContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </>
        );
    }

    if (!eventGuests.length) {
        return (
            <>
                {areStatusTabsVisible ? <GuestTabsView tabs={tabs} /> : null}
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
            {areStatusTabsVisible ? <GuestTabsView tabs={tabs} /> : null}
            <FlatList
                data={eventGuests}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ItemSeparatorComponent={renderItemSeparator}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                onEndReached={onLoadMore}
                contentContainerStyle={styles.flatlist}
            />
        </>
    );
};
