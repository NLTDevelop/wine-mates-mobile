import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { eventsService } from '@/entities/events/EventsService';
import { wineService } from '@/entities/wine/WineService';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { EventType } from '@/entities/events/enums/EventType';
import { RepeatRule, REPEAT_RULES } from '@/entities/events/enums/RepeatRule';
import { TastingType, TASTING_TYPES } from '@/entities/events/enums/TastingType';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { IWineSearchResultViewItem, IWineSetViewItem } from '@/modules/event/types/IWineSetViewItem';
import { useUiContext } from '@/UIProvider';
import { wineSetScannerModel } from '../../../../../entities/events/WineSetScannerModel';

interface IRepeatRuleItem {
    value: RepeatRule;
    label: string;
    onPress: () => void;
}

interface ITastingTypeItem {
    value: TastingType;
    label: string;
    onPress: () => void;
}

type Route = RouteProp<EventStackParamList, 'AddWineSetView'>;

const REPEAT_RULE_LABEL_KEYS: Record<RepeatRule, string> = {
    [RepeatRule.Never]: 'event.repeatNever',
    [RepeatRule.Daily]: 'event.repeatDaily',
    [RepeatRule.Weekly]: 'event.repeatWeekly',
    [RepeatRule.Monthly]: 'event.repeatMonthly',
};

const TASTING_TYPE_LABEL_KEYS: Record<TastingType, string> = {
    [TastingType.Blind]: 'event.tastingTypeBlind',
    [TastingType.Regular]: 'event.tastingTypeRegular',
};

const SEARCH_LIMIT = 10;
const MIN_SEARCH_LENGTH = 1;
const MAX_VISIBLE_SEARCH_RESULTS = 3;

const getWineTitle = (wine: IWineSetSearchItem) => {
    const name = wine.name?.trim();
    const vintage = wine.vintage ? ` ${wine.vintage}` : '';

    if (name) {
        return `${name}${vintage}`;
    }

    return `Wine #${wine.id}`;
};

const getSearchText = (value?: string | { name?: string | null } | null) => {
    if (!value) {
        return '';
    }

    if (typeof value === 'string') {
        return value.trim();
    }

    return value.name?.trim() || '';
};

const getWineSubtitle = (wine: IWineSetSearchItem) => {
    const parts = [wine.producer, wine.grapeVariety, wine.country, wine.region]
        .map(getSearchText)
        .filter(Boolean);

    return parts.join(' / ');
};

export const useAddWineSetView = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<Route>();
    const { t } = useUiContext();
    const draft = route.params?.draft;
    const searchInputRef = useRef<TextInput>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [repeatRule, setRepeatRule] = useState<RepeatRule>(RepeatRule.Never);
    const [repeatRuleDraft, setRepeatRuleDraft] = useState<RepeatRule>(RepeatRule.Never);
    const [tastingType, setTastingType] = useState<TastingType>(draft?.tastingType || TastingType.Regular);
    const [tastingTypeDraft, setTastingTypeDraft] = useState<TastingType>(draft?.tastingType || TastingType.Regular);
    const [isTastingTypeModalVisible, setIsTastingTypeModalVisible] = useState(false);
    const [isRepeatModalVisible, setIsRepeatModalVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isSearchingWines, setIsSearchingWines] = useState(false);
    const [isEventCreatedAlertVisible, setIsEventCreatedAlertVisible] = useState(false);
    const [createdEventId, setCreatedEventId] = useState<number | null>(null);
    const [selectedWines, setSelectedWines] = useState<IWineSetSearchItem[]>(() => {
        const initialWines = draft ? route.params?.initialSelectedWines || [] : [];
        const selectedWine = route.params?.selectedWine;

        if (!selectedWine || initialWines.some(item => item.id === selectedWine.id)) {
            return initialWines;
        }

        return [...initialWines, selectedWine];
    });
    const [wineSearchResults, setWineSearchResults] = useState<IWineSetSearchItem[]>([]);

    const onChangeSearchQuery = useCallback((value: string) => {
        setSearchQuery(value);

        if (value.trim().length < MIN_SEARCH_LENGTH) {
            setWineSearchResults([]);
            setIsSearchingWines(false);
        }
    }, []);

    useEffect(() => {
        const selectedWine = route.params?.selectedWine;

        if (!selectedWine) {
            return;
        }

        const frameId = requestAnimationFrame(() => {
            setSelectedWines(prev => {
                if (prev.some(item => item.id === selectedWine.id)) {
                    return prev;
                }

                return [...prev, selectedWine];
            });
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [route.params?.selectedWine]);

    useEffect(() => {
        const replacedWine = route.params?.replacedWine;

        if (!replacedWine) {
            return;
        }

        const frameId = requestAnimationFrame(() => {
            setSelectedWines(prev => {
                const nextWines = [...prev];
                const wineIndex = nextWines.findIndex(item => item.id === replacedWine.previousWineId);

                if (wineIndex === -1) {
                    if (nextWines.some(item => item.id === replacedWine.newWine.id)) {
                        return prev;
                    }

                    return [...nextWines, replacedWine.newWine];
                }

                nextWines[wineIndex] = replacedWine.newWine;
                return nextWines;
            });
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [route.params?.replacedWine]);

    useEffect(() => {
        const normalizedQuery = searchQuery.trim();

        if (normalizedQuery.length < MIN_SEARCH_LENGTH) {
            return undefined;
        }

        let isActive = true;

        const timeoutId = setTimeout(async () => {
            try {
                setIsSearchingWines(true);
                const response = await wineService.searchWineSet({
                    query: normalizedQuery,
                    limit: SEARCH_LIMIT,
                    offset: 0,
                });

                if (!isActive) {
                    return;
                }

                if (!response.isError && response.data?.rows) {
                    setWineSearchResults(response.data.rows);
                    return;
                }

                setWineSearchResults([]);
            } catch (error) {
                if (isActive) {
                    setWineSearchResults([]);
                }

                console.warn('useAddWineSetView -> searchWineSet: ', error);
            } finally {
                if (isActive) {
                    setIsSearchingWines(false);
                }
            }
        }, 500);

        return () => {
            isActive = false;
            clearTimeout(timeoutId);
        };
    }, [searchQuery]);

    const onOpenRepeatModal = useCallback(() => {
        setRepeatRuleDraft(repeatRule);
        setIsRepeatModalVisible(true);
    }, [repeatRule]);

    const onOpenTastingTypeModal = useCallback(() => {
        setTastingTypeDraft(tastingType);
        setIsTastingTypeModalVisible(true);
    }, [tastingType]);

    const onCloseRepeatModal = useCallback(() => {
        setIsRepeatModalVisible(false);
    }, []);

    const onCloseTastingTypeModal = useCallback(() => {
        setIsTastingTypeModalVisible(false);
    }, []);

    const createOnSelectRepeatRule = useCallback((value: RepeatRule) => {
        return () => {
            setRepeatRuleDraft(value);
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

    const createOnSelectTastingType = useCallback((value: TastingType) => {
        return () => {
            setTastingTypeDraft(value);
        };
    }, []);

    const tastingTypeItems = useMemo<ITastingTypeItem[]>(() => {
        return TASTING_TYPES.map((value) => {
            const tastingValue = value as TastingType;

            return {
                value: tastingValue,
                label: t(TASTING_TYPE_LABEL_KEYS[tastingValue]),
                onPress: createOnSelectTastingType(tastingValue),
            };
        });
    }, [createOnSelectTastingType, t]);

    const tastingTypeLabel = useMemo(() => {
        return t(TASTING_TYPE_LABEL_KEYS[tastingType]);
    }, [t, tastingType]);

    const repeatRuleLabel = useMemo(() => {
        return t(REPEAT_RULE_LABEL_KEYS[repeatRule]);
    }, [repeatRule, t]);

    const isCreateEventDisabled = selectedWines.length === 0;

    const onConfirmRepeatRule = useCallback(() => {
        setIsRepeatModalVisible(false);

        requestAnimationFrame(() => {
            setRepeatRule((prev) => {
                if (prev === repeatRuleDraft) {
                    return prev;
                }

                return repeatRuleDraft;
            });
        });
    }, [repeatRuleDraft]);

    const onConfirmTastingType = useCallback(() => {
        setIsTastingTypeModalVisible(false);

        requestAnimationFrame(() => {
            setTastingType((prev) => {
                if (prev === tastingTypeDraft) {
                    return prev;
                }

                return tastingTypeDraft;
            });
        });
    }, [tastingTypeDraft]);

    const onAddWinePress = useCallback(() => {
        searchInputRef.current?.focus();
    }, []);

    const createOnSelectWinePress = useCallback((wine: IWineSetSearchItem) => {
        return () => {
            setSelectedWines(prev => {
                if (prev.some(item => item.id === wine.id)) {
                    return prev;
                }

                return [...prev, wine];
            });
            setSearchQuery('');
            setWineSearchResults([]);
        };
    }, []);

    const createOnEditWinePress = useCallback((wine: IWineSetSearchItem) => {
        return () => {
            if (!draft) {
                return;
            }

            navigation.navigate('EditEventWineView', {
                wineId: wine.id,
                wine,
                draft,
                selectedWines,
            });
        };
    }, [draft, navigation, selectedWines]);

    const wineSetViewItems = useMemo<IWineSetViewItem[]>(() => {
        return selectedWines.map((item) => ({
            id: item.id,
            title: getWineTitle(item),
            onEditPress: createOnEditWinePress(item),
        }));
    }, [createOnEditWinePress, selectedWines]);

    const wineSearchResultItems = useMemo<IWineSearchResultViewItem[]>(() => {
        return wineSearchResults
            .filter(item => !selectedWines.some(wine => wine.id === item.id))
            .map(item => ({
                ...item,
                title: getWineTitle(item),
                subtitle: getWineSubtitle(item),
                onPress: createOnSelectWinePress(item),
            }));
    }, [createOnSelectWinePress, selectedWines, wineSearchResults]);

    const hasWineSearchQuery = searchQuery.trim().length >= MIN_SEARCH_LENGTH;
    const shouldShowScannerButton = hasWineSearchQuery && !isSearchingWines && wineSearchResultItems.length === 0;

    const onOpenScannerPress = useCallback(() => {
        if (!draft) {
            return;
        }

        wineSetScannerModel.setState({
            draft,
            selectedWines,
        });

        navigation.navigate('TabNavigator', {
            screen: 'ScannerStack',
            params: {
                screen: 'ScannerView',
            },
        });
    }, [draft, navigation, selectedWines]);

    const onGetCreatedEventId = useCallback((data: unknown): number | null => {
        if (!data || typeof data !== 'object') {
            return null;
        }

        const source = data as { id?: unknown; data?: unknown };
        const directId = source.id;
        if (typeof directId === 'number') {
            return directId;
        }

        if (typeof directId === 'string') {
            const parsedId = Number(directId);
            if (Number.isFinite(parsedId)) {
                return parsedId;
            }
        }

        if (!source.data || typeof source.data !== 'object') {
            return null;
        }

        const nestedId = (source.data as { id?: unknown }).id;
        if (typeof nestedId === 'number') {
            return nestedId;
        }

        if (typeof nestedId === 'string') {
            const parsedId = Number(nestedId);
            if (Number.isFinite(parsedId)) {
                return parsedId;
            }
        }

        return null;
    }, []);

    const onCreateEventPress = useCallback(async () => {
        if (isCreating || !draft || !draft.location || selectedWines.length === 0) {
            return;
        }

        try {
            setIsCreating(true);

            const wineSet = selectedWines.map((item, index) => ({
                wineId: item.id,
                sortOrder: index + 1,
            }));

            const partyPayload = draft.eventType === EventType.Parties
                ? {
                    minAge: draft.minAge,
                    maxAge: draft.maxAge,
                    sex: draft.sex,
                    participationCondition: draft.participationCondition,
                }
                : {};

            const response = await eventsService.createEvent({
                theme: draft.theme,
                description: draft.description,
                restaurantName: draft.restaurantName,
                locationLabel: draft.locationLabel,
                latitude: draft.location.latitude,
                longitude: draft.location.longitude,
                eventStartDate: draft.eventStartDate,
                eventEndDate: draft.eventEndDate,
                eventStartTime: draft.eventStartTime,
                eventEndTime: draft.eventEndTime,
                paymentMethodIds: draft.paymentMethodIds,
                price: Number(draft.price),
                currency: draft.currency,
                speakerName: draft.speakerName,
                language: draft.language,
                seats: Number(draft.seats),
                phoneNumber: draft.phoneNumber,
                eventType: draft.eventType,
                tastingType,
                requiresConfirmation: draft.requiresConfirmation,
                repeatRule,
                wineSet,
                ...partyPayload,
            }, draft.locationCountry);

            if (!response.isError) {
                const eventId = onGetCreatedEventId(response.data);
                setCreatedEventId(eventId);
                setIsEventCreatedAlertVisible(true);
            }
        } catch (error) {
            console.warn('useAddWineSetView -> onCreateEventPress: ', error);
        } finally {
            setIsCreating(false);
        }
    }, [draft, isCreating, onGetCreatedEventId, repeatRule, selectedWines, tastingType]);

    const resetToEventList = useCallback(() => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'TabNavigator',
                        state: {
                            index: 0,
                            routes: [
                                {
                                    name: 'EventStack',
                                    state: {
                                        index: 0,
                                        routes: [{ name: 'EventMapView' }],
                                    },
                                },
                            ],
                        },
                    },
                ],
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
                    index: 0,
                    routes: [
                        {
                            name: 'TabNavigator',
                            state: {
                                index: 0,
                                routes: [
                                    {
                                        name: 'EventStack',
                                        state: {
                                            index: 1,
                                            routes: [
                                                { name: 'EventMapView' },
                                                { name: 'EventDetailsView', params: { eventId: createdEventId } },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
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
        tastingType: tastingTypeDraft,
        tastingTypeLabel,
        tastingTypeItems,
        repeatRule: repeatRuleDraft,
        repeatRuleLabel,
        repeatRuleItems,
        isTastingTypeModalVisible,
        wineSetViewItems,
        wineSearchResultItems,
        isSearchingWines,
        shouldShowScannerButton,
        maxVisibleSearchResults: MAX_VISIBLE_SEARCH_RESULTS,
        isRepeatModalVisible,
        isEventCreatedAlertVisible,
        isCreating,
        isCreateEventDisabled,
        searchInputRef,
        onChangeSearchQuery,
        onOpenRepeatModal,
        onOpenTastingTypeModal,
        onCloseRepeatModal,
        onCloseTastingTypeModal,
        onConfirmRepeatRule,
        onConfirmTastingType,
        onCloseEventCreatedAlert,
        onCheckEventPress,
        onShareQrPress,
        onAddWinePress,
        onOpenScannerPress,
        onCreateEventPress,
    };
};
