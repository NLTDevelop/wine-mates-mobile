import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { homeSectionsService } from '@/entities/homeSections/HomeSectionsService';
import { homeSectionsModel } from '@/entities/homeSections/HomeSectionsModel';
import { IHomeSection } from '@/entities/homeSections/types/IHomeSection';
import { HomeSectionKey } from '@/entities/homeSections/types/HomeSectionKey';
import { IHomeSectionOption } from '../ui/HomeView/types/IHomeSectionOption';
import { IHomeVisibleSection } from '../ui/HomeView/types/IHomeVisibleSection';
import { IUpdateHomeSectionItemDto } from '@/entities/homeSections/dto/UpdateHomeSections.dto';
import { localization } from '@/UIProvider/localization/Localization';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType } from '@/entities/events/enums/TastingType';
import type { SortableGridDragEndParams } from 'react-native-sortables';
import { toastService } from '@/libs/toast/toastService';
import { notificationsService } from '@/entities/notifications/NotificationsService';
import { getCurrentLocationPayload } from '@/libs/locations/getCurrentLocationPayload';
import { IHomeSectionsListParams } from '@/entities/homeSections/params/IHomeSectionsListParams';
import { locationModel } from '@/entities/location/LocationModel';

const EMPTY_FIELD = '-';

const DEFAULT_SECTIONS: IUpdateHomeSectionItemDto[] = [
    {
        key: 'choose_wine',
        sortOrder: 0,
        isVisible: false,
    },
    {
        key: 'events',
        sortOrder: 1,
        isVisible: false,
    },
    {
        key: 'people_talking',
        sortOrder: 2,
        isVisible: false,
    },
];

const getOrderedSections = (sections: IHomeSection[]) => {
    const normalizedSections = getNormalizedSections(sections);
    const visibleSections = getSortedSections(normalizedSections).filter(section => section.isVisible);
    const hiddenSections = getSortedSections(normalizedSections).filter(section => !section.isVisible);
    const sortedSections = [...visibleSections, ...hiddenSections];

    return sortedSections.map((section, index) => ({
        ...section,
        sortOrder: index,
    }));
};

const getSectionPayload = (sections: IHomeSection[]) => {
    const orderedSections = getOrderedSections(sections);

    return orderedSections.map(section => ({
        key: section.key,
        sortOrder: section.sortOrder,
        isVisible: section.isVisible,
    }));
};

const showHomeRequestError = (message?: string) => {
    toastService.showError(
        localization.t('common.errorHappened'),
        message || localization.t('common.somethingWentWrong'),
    );
};

const throwLocationUnavailableError = (): never => {
    const message = localization.t('permissions.locationUnavailable');

    showHomeRequestError(message);
    throw new Error(message);
};

const getCachedLocationParams = (): IHomeSectionsListParams | null => {
    if (!locationModel.userLocation) {
        return null;
    }

    return {
        lat: locationModel.userLocation.latitude,
        lon: locationModel.userLocation.longitude,
    };
};

const getHomeSectionsListParams = async (shouldRecheckLocation = false): Promise<IHomeSectionsListParams> => {
    try {
        const cachedLocationParams = getCachedLocationParams();

        if (cachedLocationParams && !shouldRecheckLocation) {
            return cachedLocationParams;
        }

        if (!shouldRecheckLocation && !locationModel.hasPermission && !locationModel.isLoading) {
            throwLocationUnavailableError();
        }

        locationModel.setIsLoading(true);
        const location = await getCurrentLocationPayload();
        locationModel.setHasPermission(!!location);

        if (location) {
            locationModel.setUserLocation({
                latitude: location.latitude,
                longitude: location.longitude,
            });

            return {
                lat: location.latitude,
                lon: location.longitude,
            };
        }

        if (cachedLocationParams) {
            return cachedLocationParams;
        }

        return throwLocationUnavailableError();
    } catch (error) {
        console.warn('useHomeView -> getHomeSectionsListParams: ', error);
        throw error;
    } finally {
        locationModel.setIsLoading(false);
    }
};

const getSortedSections = (sections: IHomeSection[]) => {
    return [...sections].sort((first, second) => first.sortOrder - second.sortOrder);
};

const getNormalizedSections = (sections: IHomeSection[]) => {
    return DEFAULT_SECTIONS.map(defaultSection => {
        const apiSection = sections.find(section => section.key === defaultSection.key);

        if (apiSection) {
            return {
                ...apiSection,
                sortOrder: apiSection.sortOrder ?? defaultSection.sortOrder,
                isVisible: Boolean(apiSection.isVisible),
            };
        }

        return defaultSection;
    });
};

const getEmptyHomeEvent = (): IEvent => {
    return {
        id: 0,
        theme: EMPTY_FIELD,
        eventStartDate: undefined,
        eventEndDate: undefined,
        eventStartTime: undefined,
        eventEndTime: undefined,
        locationLabel: EMPTY_FIELD,
        price: EMPTY_FIELD as unknown as number,
        priceUsd: EMPTY_FIELD as unknown as number,
        currency: '',
        description: EMPTY_FIELD,
        latitude: null as unknown as number,
        longitude: null as unknown as number,
        distanceKm: null,
        acceptedCount: 0,
        participants: [],
        isSaved: false,
        eventType: undefined,
        tastingType: undefined,
    };
};

const createHomeEvents = (section: IHomeSection): IEvent[] => {
    const emptyEvent = getEmptyHomeEvent();

    if (section.key !== 'events') {
        return [emptyEvent];
    }

    const data = section.data;
    if (!Array.isArray(data) || !data.length) {
        return [];
    }

    return data.map(item => ({
        ...emptyEvent,
        id: item.id || emptyEvent.id,
        ownerId: item.ownerId,
        isActive: item.isActive,
        theme: item.theme || EMPTY_FIELD,
        restaurantName: item.restaurantName || undefined,
        eventStartDate: item.eventStartDate || undefined,
        eventEndDate: item.eventEndDate || item.eventStartDate || undefined,
        eventStartTime: item.eventStartTime || undefined,
        eventEndTime: item.eventEndTime || undefined,
        locationLabel: item.locationLabel || EMPTY_FIELD,
        price: (item.price ?? EMPTY_FIELD) as unknown as number,
        priceUsd: (item.priceUsd ?? item.price ?? EMPTY_FIELD) as unknown as number,
        currency: item.currency || '',
        description: item.description || EMPTY_FIELD,
        latitude: (item.latitude ?? null) as unknown as number,
        longitude: (item.longitude ?? null) as unknown as number,
        distanceKm: item.distanceKm ?? null,
        acceptedCount: item.acceptedCount ?? 0,
        participants: item.participants || [],
        isSaved: Boolean(item.isSaved),
        seats: item.seats || undefined,
        eventType: item.eventType === EventType.Parties || item.eventType === EventType.Tastings
            ? item.eventType
            : undefined,
        tastingType: item.tastingType === TastingType.Blind || item.tastingType === TastingType.Regular
            ? item.tastingType
            : undefined,
    }));
};

const getPeopleTalkingCreatedAtLabel = (createdAt?: string | null, locale?: string) => {
    if (!createdAt) {
        return EMPTY_FIELD;
    }

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) {
        return EMPTY_FIELD;
    }

    const diffInMilliseconds = Date.now() - date.getTime();
    const diffInDays = Math.max(1, Math.floor(diffInMilliseconds / 86400000));

    return localization.t('home.peopleTalkingDaysAgo', {
        count: diffInDays,
        locale,
    });
};

const getAuthorName = (firstName?: string, lastName?: string) => {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();

    return fullName || EMPTY_FIELD;
};

const getAvatarUrl = (avatar?: { smallUrl?: string; mediumUrl?: string; originalUrl?: string } | null) => {
    return avatar?.mediumUrl || avatar?.smallUrl || avatar?.originalUrl || null;
};

const createPeopleTalking = (section: IHomeSection, locale: string) => {
    if (section.key !== 'people_talking') {
        return [];
    }

    const data = section.data;
    if (!Array.isArray(data) || !data.length) {
        return [];
    }

    return data.map(item => {
        const likesCount = item.likesCount || 0;
        const commentsCount = item.commentsCount || 0;

        return {
            authorName: getAuthorName(item.author?.firstName, item.author?.lastName),
            authorAvatar: getAvatarUrl(item.author?.avatar),
            text: item.text || EMPTY_FIELD,
            likesCount,
            commentsCount,
            hasLikes: likesCount > 0,
            hasComments: commentsCount > 0,
            createdAtLabel: getPeopleTalkingCreatedAtLabel(item.createdAt, locale),
        };
    });
};

export const useHomeView = (locale: string) => {
    const isMountedRef = useRef(true);
    const [draftSections, setDraftSections] = useState<IHomeSection[]>([]);
    const [placementSections, setPlacementSections] = useState<IHomeSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSectionsModalVisible, setIsSectionsModalVisible] = useState(false);
    const [isPlacementEditMode, setIsPlacementEditMode] = useState(false);
    const [isError, setIsError] = useState(false);

    const sections = homeSectionsModel.sections;

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const normalizedSections = useMemo(() => {
        return getNormalizedSections(sections);
    }, [sections]);

    const visibleSections = useMemo(() => {
        return getSortedSections(normalizedSections).filter(section => section.isVisible);
    }, [normalizedSections]);

    const placementVisibleSections = useMemo(() => {
        return getSortedSections(getNormalizedSections(placementSections)).filter(section => section.isVisible);
    }, [placementSections]);

    const activeVisibleSections = isPlacementEditMode ? placementVisibleSections : visibleSections;
    const hasVisibleSections = visibleSections.length > 0;
    const hasConfiguredSections = activeVisibleSections.length > 0;
    const canConfigurePlacement = hasVisibleSections && !isPlacementEditMode;

    const requestHomeSections = useCallback(async (shouldRecheckLocation = false) => {
        const params = await getHomeSectionsListParams(shouldRecheckLocation);

        return homeSectionsService.list(params);
    }, []);

    const onRemovePlacementSection = useCallback((key: HomeSectionKey) => {
        setPlacementSections(currentSections => currentSections.map(section => {
            if (section.key !== key) {
                return section;
            }

            return {
                ...section,
                isVisible: false,
            };
        }));
    }, []);

    const visibleSectionItems = useMemo<IHomeVisibleSection[]>(() => {
        return activeVisibleSections.map(section => {
            const onRemovePress = isPlacementEditMode
                ? () => onRemovePlacementSection(section.key)
                : undefined;

            if (section.key === 'events') {
                return {
                    key: section.key,
                    sortOrder: section.sortOrder,
                    title: localization.t('home.events', { locale }),
                    onRemovePress,
                    events: createHomeEvents(section),
                };
            }

            if (section.key === 'people_talking') {
                return {
                    key: section.key,
                    sortOrder: section.sortOrder,
                    title: localization.t('home.peopleTalking', { locale }),
                    onRemovePress,
                    peopleTalking: createPeopleTalking(section, locale),
                };
            }

            return {
                key: section.key,
                sortOrder: section.sortOrder,
                title: localization.t('home.chooseWine', { locale }),
                onRemovePress,
            };
        });
    }, [activeVisibleSections, isPlacementEditMode, locale, onRemovePlacementSection]);

    const getHomeSections = useCallback(async () => {
        setIsError(false);
        setIsLoading(true);

        try {
            const [response] = await Promise.all([
                requestHomeSections(true),
                notificationsService.getCount(),
            ]);

            if (!isMountedRef.current) {
                return;
            }

            if (response.isError) {
                setIsError(true);
            }
        } catch (error) {
            console.warn('useHomeView -> getHomeSections: ', error);

            if (isMountedRef.current) {
                setIsError(true);
                if (!(error instanceof Error) || error.message !== localization.t('permissions.locationUnavailable')) {
                    showHomeRequestError(error instanceof Error ? error.message : undefined);
                }
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [requestHomeSections]);

    useEffect(() => {
        const loadHomeSections = async () => {
            try {
                const response = await requestHomeSections();

                if (!isMountedRef.current) {
                    return;
                }

                if (response.isError) {
                    setIsError(true);
                }
            } catch (error) {
                console.warn('useHomeView -> loadHomeSections: ', error);

                if (isMountedRef.current) {
                    setIsError(true);
                    if (!(error instanceof Error) || error.message !== localization.t('permissions.locationUnavailable')) {
                        showHomeRequestError(error instanceof Error ? error.message : undefined);
                    }
                }
            } finally {
                if (isMountedRef.current) {
                    setIsLoading(false);
                }
            }
        };

        loadHomeSections();
    }, [requestHomeSections]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);

        try {
            const [response] = await Promise.all([
                requestHomeSections(true),
                notificationsService.getCount(),
            ]);

            if (response.isError) {
                showHomeRequestError(response.message);
            }
        } catch (error) {
            console.warn('useHomeView -> onRefresh: ', error);
            if (!(error instanceof Error) || error.message !== localization.t('permissions.locationUnavailable')) {
                showHomeRequestError(error instanceof Error ? error.message : undefined);
            }
        } finally {
            setIsRefreshing(false);
        }
    }, [requestHomeSections]);

    const onOpenSectionsModal = useCallback(() => {
        setDraftSections(normalizedSections);
        setIsSectionsModalVisible(true);
    }, [normalizedSections]);

    const onCloseSectionsModal = useCallback(() => {
        setIsSectionsModalVisible(false);
    }, []);

    const onOpenPlacementConfig = useCallback(() => {
        setPlacementSections(normalizedSections);
        setIsPlacementEditMode(true);
    }, [normalizedSections]);

    const onReorderPlacementSections = useCallback((params: SortableGridDragEndParams<IHomeVisibleSection>) => {
        const nextVisibleSections = params.data;

        setPlacementSections(currentSections => {
            const nextSortOrderByKey = nextVisibleSections.reduce<Record<HomeSectionKey, number>>((acc, section, index) => {
                acc[section.key] = index;

                return acc;
            }, {} as Record<HomeSectionKey, number>);

            return currentSections.map(section => {
                const nextSortOrder = nextSortOrderByKey[section.key];

                if (typeof nextSortOrder !== 'number') {
                    return section;
                }

                return {
                    ...section,
                    sortOrder: nextSortOrder,
                };
            });
        });
    }, []);

    const onToggleChooseWine = useCallback(() => {
        setDraftSections(currentSections => currentSections.map(section => {
            if (section.key !== 'choose_wine') {
                return section;
            }

            return {
                ...section,
                isVisible: !section.isVisible,
            };
        }));
    }, []);

    const onToggleEvents = useCallback(() => {
        setDraftSections(currentSections => currentSections.map(section => {
            if (section.key !== 'events') {
                return section;
            }

            return {
                ...section,
                isVisible: !section.isVisible,
            };
        }));
    }, []);

    const onTogglePeopleTalking = useCallback(() => {
        setDraftSections(currentSections => currentSections.map(section => {
            if (section.key !== 'people_talking') {
                return section;
            }

            return {
                ...section,
                isVisible: !section.isVisible,
            };
        }));
    }, []);

    const getIsDraftSelected = useCallback((key: HomeSectionKey) => {
        return Boolean(draftSections.find(section => section.key === key)?.isVisible);
    }, [draftSections]);

    const sectionOptions = useMemo<IHomeSectionOption[]>(() => {
        return [
            {
                key: 'choose_wine',
                title: localization.t('home.chooseWine', { locale }),
                description: localization.t('home.chooseWineSectionOptionDescription', { locale }),
                isSelected: getIsDraftSelected('choose_wine'),
                onPress: onToggleChooseWine,
            },
            {
                key: 'events',
                title: localization.t('home.events', { locale }),
                description: localization.t('home.eventsSectionOptionDescription', { locale }),
                isSelected: getIsDraftSelected('events'),
                onPress: onToggleEvents,
            },
            {
                key: 'people_talking',
                title: localization.t('home.peopleTalking', { locale }),
                description: localization.t('home.peopleTalkingSectionOptionDescription', { locale }),
                isSelected: getIsDraftSelected('people_talking'),
                onPress: onTogglePeopleTalking,
            },
        ];
    }, [getIsDraftSelected, locale, onToggleChooseWine, onToggleEvents, onTogglePeopleTalking]);

    const onSaveSections = useCallback(async () => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const params = await getHomeSectionsListParams(true);
            const normalizedDraft = getNormalizedSections(draftSections);
            const payloadSections = getSectionPayload(normalizedDraft);

            const response = await homeSectionsService.update({
                sections: payloadSections,
                ...params,
            });

            if (!response.isError) {
                if (!Array.isArray(response.data)) {
                    homeSectionsModel.sections = getOrderedSections(normalizedDraft);
                }

                setIsSectionsModalVisible(false);
            } else {
                showHomeRequestError(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }, [draftSections, isSaving]);

    const onSavePlacementSections = useCallback(async () => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const params = await getHomeSectionsListParams(true);
            const normalizedPlacementSections = getNormalizedSections(placementSections);
            const payloadSections = getSectionPayload(normalizedPlacementSections);
            const response = await homeSectionsService.update({
                sections: payloadSections,
                ...params,
            });

            if (!response.isError) {
                if (!Array.isArray(response.data)) {
                    homeSectionsModel.sections = getOrderedSections(normalizedPlacementSections);
                }

                setIsPlacementEditMode(false);
            } else {
                showHomeRequestError(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }, [isSaving, placementSections]);

    return {
        visibleSections,
        visibleSectionItems,
        hasVisibleSections,
        hasConfiguredSections,
        canConfigurePlacement,
        sectionOptions,
        isLoading,
        isRefreshing,
        isSaving,
        isError,
        isSectionsModalVisible,
        isPlacementEditMode,
        getHomeSections,
        onRefresh,
        onOpenSectionsModal,
        onCloseSectionsModal,
        onSaveSections,
        onOpenPlacementConfig,
        onReorderPlacementSections,
        onSavePlacementSections,
    };
};
