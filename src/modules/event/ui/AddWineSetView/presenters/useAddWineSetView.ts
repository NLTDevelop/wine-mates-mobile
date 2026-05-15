import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import Share from 'react-native-share';
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { eventsService } from '@/entities/events/EventsService';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType, TASTING_TYPES } from '@/entities/events/enums/TastingType';
import { RepeatRuleConfig } from '@/entities/events/types/RepeatRuleConfig';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { IWineSearchResultViewItem, IWineSetViewItem } from '@/modules/event/types/IWineSetViewItem';
import { useUiContext } from '@/UIProvider';
import { wineSetScannerModel } from '../../../../../entities/events/WineSetScannerModel';
import { toastService } from '@/libs/toast/toastService';
import { createEventDeepLink } from '@/navigation/rootNavigator/linking';

interface IWineSetDragEndPayload {
    data: IWineSetViewItem[];
}

type Route = RouteProp<EventStackParamList, 'AddWineSetView'>;

const DEFAULT_TASTING_TYPE = TASTING_TYPES[0] as TastingType;

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
    const parts = [wine.producer, wine.grapeVariety, wine.country, wine.region].map(getSearchText).filter(Boolean);

    return parts.join(' / ');
};

interface IProps {
    searchQuery: string;
    isSearchListVisible: boolean;
    isSearchingWines: boolean;
    isInitialSearchFinished: boolean;
    hasMoreSearchResults: boolean;
    wineSearchResults: IWineSetSearchItem[];
    onResetSearch: () => void;
    onOpenSearchModal: () => void;
    onLoadMoreSearchResults: () => void;
}

export const useAddWineSetView = ({
    searchQuery,
    isSearchListVisible,
    isSearchingWines,
    isInitialSearchFinished,
    hasMoreSearchResults,
    wineSearchResults,
    onResetSearch,
    onOpenSearchModal,
    onLoadMoreSearchResults,
}: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<Route>();
    const { t } = useUiContext();
    const draft = route.params?.draft;
    const editEventId = route.params?.editEventId;
    const isEditMode = typeof editEventId === 'number';
    const [repeatRule, setRepeatRule] = useState<RepeatRuleConfig | null>(draft?.repeatRule || null);
    const [tastingType, setTastingType] = useState<TastingType>(draft?.tastingType || DEFAULT_TASTING_TYPE);
    const [isCreating, setIsCreating] = useState(false);
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

    const isWineRequired = draft?.eventType !== EventType.Parties;
    const isCreateEventDisabled = isWineRequired && selectedWines.length === 0;
    const eventDeepLink = useMemo(() => {
        if (!createdEventId) {
            return null;
        }

        return createEventDeepLink(createdEventId);
    }, [createdEventId]);

    const onChangeRepeatRule = useCallback((value: RepeatRuleConfig | null) => {
        setRepeatRule(value);
    }, []);

    const onChangeTastingType = useCallback((value: TastingType) => {
        setTastingType(value);
    }, []);

    const onAddWinePress = useCallback(() => {
        onOpenSearchModal();
    }, [onOpenSearchModal]);

    const createOnSelectWinePress = useCallback(
        (wine: IWineSetSearchItem) => {
            return () => {
                setSelectedWines(prev => {
                    if (prev.some(item => item.id === wine.id)) {
                        return prev;
                    }

                    return [...prev, wine];
                });
                onResetSearch();
                Keyboard.dismiss();
            };
        },
        [onResetSearch],
    );

    const createOnEditWinePress = useCallback(
        (wine: IWineSetSearchItem) => {
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
        },
        [draft, navigation, selectedWines],
    );

    const createOnDeleteWinePress = useCallback((wineId: number) => {
        return () => {
            setSelectedWines(prev => prev.filter(item => item.id !== wineId));
        };
    }, []);

    const wineSetViewItems = useMemo<IWineSetViewItem[]>(() => {
        return selectedWines.map(item => ({
            id: item.id,
            title: getWineTitle(item),
            onEditPress: createOnEditWinePress(item),
            onDeletePress: createOnDeleteWinePress(item.id),
        }));
    }, [createOnDeleteWinePress, createOnEditWinePress, selectedWines]);

    const onReorderWineSet = useCallback(({ data }: IWineSetDragEndPayload) => {
        setSelectedWines(prev => {
            const orderMap = new Map(data.map((item, index) => [item.id, index]));
            const ordered = [...prev].sort((a, b) => {
                const leftOrder = orderMap.get(a.id);
                const rightOrder = orderMap.get(b.id);

                if (leftOrder === undefined || rightOrder === undefined) {
                    return 0;
                }

                return leftOrder - rightOrder;
            });

            return ordered;
        });
    }, []);

    const wineSearchResultItems = useMemo<IWineSearchResultViewItem[]>(() => {
        if (!isSearchListVisible) {
            return [];
        }

        return wineSearchResults
            .filter(item => !selectedWines.some(wine => wine.id === item.id))
            .map(item => ({
                ...item,
                title: getWineTitle(item),
                subtitle: getWineSubtitle(item),
                onPress: createOnSelectWinePress(item),
            }));
    }, [createOnSelectWinePress, isSearchListVisible, selectedWines, wineSearchResults]);

    useEffect(() => {
        const shouldLoadMoreFilteredResults =
            isSearchListVisible &&
            isInitialSearchFinished &&
            !isSearchingWines &&
            hasMoreSearchResults &&
            wineSearchResults.length > 0 &&
            wineSearchResultItems.length === 0;

        if (!shouldLoadMoreFilteredResults) {
            return;
        }

        onLoadMoreSearchResults();
    }, [
        hasMoreSearchResults,
        isInitialSearchFinished,
        isSearchListVisible,
        isSearchingWines,
        onLoadMoreSearchResults,
        wineSearchResultItems.length,
        wineSearchResults.length,
    ]);

    const hasWineSearchQuery = searchQuery.trim().length > 0;
    const shouldShowScannerButton =
        isSearchListVisible &&
        hasWineSearchQuery &&
        isInitialSearchFinished &&
        !isSearchingWines &&
        !hasMoreSearchResults &&
        wineSearchResultItems.length === 0;
    const wineSearchEmptyText = useMemo(() => {
        if (!hasWineSearchQuery) {
            return t('event.startTypingWineSearch');
        }

        return t('common.nothingFoundTitle');
    }, [hasWineSearchQuery, t]);

    const onOpenScannerPress = useCallback(() => {
        if (!draft) {
            return;
        }

        wineSetScannerModel.setState({
            draft,
            selectedWines,
        });
        onResetSearch();

        navigation.navigate('TabNavigator', {
            screen: 'ScannerStack',
            params: {
                screen: 'ScannerView',
            },
        });
    }, [draft, navigation, onResetSearch, selectedWines]);

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
        if (isCreating || !draft || !draft.location) {
            return;
        }

        if (isWineRequired && selectedWines.length === 0) {
            return;
        }

        try {
            setIsCreating(true);

            const wineSet = selectedWines.map((item, index) => ({
                wineId: item.id,
                sortOrder: index + 1,
            }));

            const partyPayload =
                draft.eventType === EventType.Parties
                    ? {
                          minAge: draft.minAge,
                          maxAge: draft.maxAge,
                          sex: draft.sex,
                          participationCondition: draft.participationCondition,
                      }
                    : {};

            const payload = {
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
                contactIds: draft.contactIds,
                price: Number(draft.price),
                currency: draft.currency,
                speakerName: draft.speakerName,
                language: draft.language,
                seats: Number(draft.seats),
                eventType: draft.eventType,
                tastingType,
                requiresConfirmation: draft.requiresConfirmation,
                repeatRule,
                wineSet,
                ...partyPayload,
            };

            if (isEditMode && editEventId) {
                const response = await eventsService.updateEvent(editEventId, payload as any);
                if (!response.isError) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
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
                                { name: 'EventDetailsView', params: { eventId: editEventId } },
                            ],
                        }),
                    );
                    return;
                }

                toastService.showError(t('common.errorHappened'), response.message || t('common.somethingWentWrong'));
                return;
            }

            const response = await eventsService.createEvent(payload, draft.locationCountry);

            if (!response.isError) {
                const eventId = onGetCreatedEventId(response.data);
                setCreatedEventId(eventId);
                setIsEventCreatedAlertVisible(true);
                return;
            }

            toastService.showError(t('common.errorHappened'), response.message || t('common.somethingWentWrong'));
        } catch (error) {
            console.warn('useAddWineSetView -> onCreateEventPress: ', error);
            toastService.showError(t('common.errorHappened'), t('common.somethingWentWrong'));
        } finally {
            setIsCreating(false);
        }
    }, [draft, editEventId, isCreating, isEditMode, isWineRequired, navigation, onGetCreatedEventId, repeatRule, selectedWines, t, tastingType]);

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
                    index: 1,
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
                        { name: 'EventDetailsView', params: { eventId: createdEventId } },
                    ],
                }),
            );
            return;
        }

        // TODO: remove fallback after backend starts returning created event id.
        resetToEventList();
    }, [createdEventId, navigation, resetToEventList]);

    const onShareQrPress = useCallback(
        async (qrCodeImageUrl: string | null) => {
            if (!eventDeepLink || !qrCodeImageUrl) {
                toastService.showError(t('common.errorHappened'), t('event.shareQrCodeUnavailable'));
                return;
            }

            try {
                await Share.open({
                    failOnCancel: false,
                    filenames: [`wine-event-${createdEventId}-qr.png`],
                    message: `${t('event.shareQrCodeMessage')}\n${eventDeepLink}`,
                    title: t('event.shareQrCodeTitle'),
                    type: 'image/png',
                    urls: [qrCodeImageUrl],
                    subject: t('event.shareQrCodeTitle'),
                    useInternalStorage: true,
                });
            } catch (error) {
                console.warn('useAddWineSetView -> onShareQrPress: ', error);
                toastService.showError(t('common.errorHappened'), t('common.somethingWentWrong'));
            }
        },
        [createdEventId, eventDeepLink, t],
    );

    return {
        searchQuery,
        tastingType,
        repeatRule,
        wineSetViewItems,
        wineSearchResultItems,
        isSearchingWines,
        shouldShowScannerButton,
        wineSearchEmptyText,
        isSearchListVisible,
        isEventCreatedAlertVisible,
        eventDeepLink,
        isCreating,
        isCreateEventDisabled,
        isEditMode,
        onChangeRepeatRule,
        onChangeTastingType,
        onCloseEventCreatedAlert,
        onCheckEventPress,
        onShareQrPress,
        onAddWinePress,
        onOpenScannerPress,
        onReorderWineSet,
        onCreateEventPress,
    };
};
