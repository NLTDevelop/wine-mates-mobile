import { useCallback, useMemo, useState } from 'react';
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { eventService } from '@/entities/events/EventService';
import { RepeatRule, REPEAT_RULES } from '@/entities/events/enums/RepeatRule';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { IWineSetMockItem, IWineSetViewItem } from '@/modules/event/types/IWineSetMockItem';
import { useUiContext } from '@/UIProvider';

interface IRepeatRuleItem {
    value: RepeatRule;
    label: string;
    onPress: () => void;
}

type Navigation = NativeStackNavigationProp<EventStackParamList>;
type Route = RouteProp<EventStackParamList, 'AddWineSetView'>;

const REPEAT_RULE_LABEL_KEYS: Record<RepeatRule, string> = {
    [RepeatRule.Never]: 'event.repeatNever',
    [RepeatRule.Daily]: 'event.repeatDaily',
    [RepeatRule.Weekly]: 'event.repeatWeekly',
    [RepeatRule.Monthly]: 'event.repeatMonthly',
};

export const useAddWineSetView = () => {
    const navigation = useNavigation<Navigation>();
    const route = useRoute<Route>();
    const { t } = useUiContext();

    const [searchQuery, setSearchQuery] = useState('');
    const [repeatRule, setRepeatRule] = useState<RepeatRule>(RepeatRule.Never);
    const [isRepeatModalVisible, setIsRepeatModalVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isEventCreatedAlertVisible, setIsEventCreatedAlertVisible] = useState(false);
    const [createdEventId, setCreatedEventId] = useState<number | null>(null);

    const draft = route.params.draft;

    const mockWineSetItems = useMemo<IWineSetMockItem[]>(() => {
        // TODO: replace mock list with backend data when wine set API is connected.
        return [
            { id: 204, title: 'Chateau Palmer 2014' },
            { id: 203, title: 'Chateau Palmer 2014' },
            { id: 202, title: 'Chateau Palmer 2014' },
        ];
    }, []);

    const onChangeSearchQuery = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const onOpenRepeatModal = useCallback(() => {
        setIsRepeatModalVisible(true);
    }, []);

    const onCloseRepeatModal = useCallback(() => {
        setIsRepeatModalVisible(false);
    }, []);

    const createOnSelectRepeatRule = useCallback((value: RepeatRule) => {
        return () => {
            setRepeatRule(value);
            setIsRepeatModalVisible(false);
        };
    }, []);

    const repeatRuleItems = useMemo<IRepeatRuleItem[]>(() => {
        return REPEAT_RULES.map((value) => {
            const repeatValue = value as RepeatRule;
            return {
                value: repeatValue,
                label: t(REPEAT_RULE_LABEL_KEYS[repeatValue]),
                onPress: createOnSelectRepeatRule(repeatValue),
            };
        });
    }, [createOnSelectRepeatRule, t]);

    const repeatRuleLabel = useMemo(() => {
        return t(REPEAT_RULE_LABEL_KEYS[repeatRule]);
    }, [repeatRule, t]);

    const filteredMockWineSetItems = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return mockWineSetItems;
        }

        return mockWineSetItems.filter((item) => item.title.toLowerCase().includes(normalizedQuery));
    }, [mockWineSetItems, searchQuery]);

    const onAddWinePress = useCallback(() => {
        // TODO: connect navigation to add wine flow when wine screen is finalized.
    }, []);

    const createOnEditWinePress = useCallback((wineId: number) => {
        return () => {
            navigation.navigate('EditEventWineView', { wineId });
        };
    }, [navigation]);

    const wineSetViewItems = useMemo<IWineSetViewItem[]>(() => {
        return filteredMockWineSetItems.map((item) => ({
            ...item,
            onEditPress: createOnEditWinePress(item.id),
        }));
    }, [createOnEditWinePress, filteredMockWineSetItems]);

    const onCreateEventPress = useCallback(async () => {
        if (isCreating) {
            return;
        }

        try {
            setIsCreating(true);

            // TODO: use selected wine set from backend when API is connected.
            const mockWineSet = mockWineSetItems.map((item, index) => ({
                wineId: item.id,
                sortOrder: index + 1,
            }));

            const response = await eventService.createEvent({
                theme: draft.theme,
                description: draft.description,
                restaurantName: draft.restaurantName,
                locationLabel: draft.locationLabel,
                latitude: draft.location.latitude,
                longitude: draft.location.longitude,
                eventDate: draft.eventDate,
                eventTime: draft.eventTime,
                price: Number(draft.price),
                currency: draft.currency,
                speakerName: draft.speakerName,
                language: draft.language,
                seats: Number(draft.seats),
                phoneNumber: draft.phoneNumber,
                age: Number(draft.age),
                sex: draft.sex,
                eventType: draft.eventType,
                tastingType: draft.tastingType,
                participationCondition: draft.participationCondition,
                requiresConfirmation: draft.requiresConfirmation,
                repeatRule,
                wineSet: mockWineSet,
            });

            if (!response.isError) {
                // TODO: backend should return created event id in response.data.id after create event.
                setCreatedEventId(response.data?.id ?? null);
                setIsEventCreatedAlertVisible(true);
            }
        } catch (error) {
            console.warn('useAddWineSetView -> onCreateEventPress: ', error);
        } finally {
            setIsCreating(false);
        }
    }, [draft, isCreating, mockWineSetItems, repeatRule]);

    const resetToEventList = useCallback(() => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'EventMapView' }],
            }),
        );
    }, [navigation]);

    const onCloseEventCreatedAlert = useCallback(() => {
        setIsEventCreatedAlertVisible(false);
        resetToEventList();
    }, [resetToEventList]);

    const onCheckEventPress = useCallback(() => {
        setIsEventCreatedAlertVisible(false);

        if (createdEventId) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'EventMapView' },
                        { name: 'EventDetails', params: { eventId: createdEventId } },
                    ],
                }),
            );
            return;
        }

        // TODO: remove fallback after backend starts returning created event id.
        resetToEventList();
    }, [createdEventId, navigation, resetToEventList]);

    const onShareQrPress = useCallback(() => {
        setIsEventCreatedAlertVisible(false);
        // TODO: implement share QR code for created event when API contract for QR is ready.
        resetToEventList();
    }, [resetToEventList]);

    return {
        searchQuery,
        repeatRule,
        repeatRuleLabel,
        repeatRuleItems,
        wineSetViewItems,
        isRepeatModalVisible,
        isEventCreatedAlertVisible,
        isCreating,
        onChangeSearchQuery,
        onOpenRepeatModal,
        onCloseRepeatModal,
        onCloseEventCreatedAlert,
        onCheckEventPress,
        onShareQrPress,
        onAddWinePress,
        onCreateEventPress,
    };
};
