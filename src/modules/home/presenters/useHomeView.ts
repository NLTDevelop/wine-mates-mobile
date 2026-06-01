import { useCallback, useEffect, useMemo, useState } from 'react';
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

const getDefaultSection = (key: HomeSectionKey) => {
    return DEFAULT_SECTIONS.find(item => item.key === key);
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
        return [emptyEvent];
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

const getPeopleTalkingCreatedAtLabel = (createdAt?: string | null) => {
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
    });
};

const getAuthorName = (firstName?: string, lastName?: string) => {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();

    return fullName || EMPTY_FIELD;
};

const getAvatarUrl = (avatar?: { smallUrl?: string; mediumUrl?: string; originalUrl?: string } | null) => {
    return avatar?.mediumUrl || avatar?.smallUrl || avatar?.originalUrl || null;
};

const createPeopleTalking = (section: IHomeSection) => {
    if (section.key !== 'people_talking') {
        return [];
    }

    const data = section.data;
    if (!Array.isArray(data) || !data.length) {
        return [{
            authorName: EMPTY_FIELD,
            authorAvatar: null,
            text: EMPTY_FIELD,
            likesCount: 0,
            commentsCount: 0,
            hasLikes: false,
            hasComments: false,
            createdAtLabel: EMPTY_FIELD,
        }];
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
            createdAtLabel: getPeopleTalkingCreatedAtLabel(item.createdAt),
        };
    });
};

export const useHomeView = () => {
    const [draftSections, setDraftSections] = useState<IHomeSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSectionsModalVisible, setIsSectionsModalVisible] = useState(false);

    const sections = homeSectionsModel.sections;

    const normalizedSections = useMemo(() => {
        return getNormalizedSections(sections);
    }, [sections]);

    const visibleSections = useMemo(() => {
        return getSortedSections(normalizedSections).filter(section => section.isVisible);
    }, [normalizedSections]);

    const hasVisibleSections = visibleSections.length > 0;

    const visibleSectionItems = useMemo<IHomeVisibleSection[]>(() => {
        return visibleSections.map(section => {
            if (section.key === 'events') {
                return {
                    key: section.key,
                    sortOrder: section.sortOrder,
                    title: localization.t('home.events'),
                    events: createHomeEvents(section),
                };
            }

            if (section.key === 'people_talking') {
                return {
                    key: section.key,
                    sortOrder: section.sortOrder,
                    title: localization.t('home.peopleTalking'),
                    peopleTalking: createPeopleTalking(section),
                };
            }

            return {
                key: section.key,
                sortOrder: section.sortOrder,
                title: localization.t('home.chooseWine'),
            };
        });
    }, [visibleSections]);

    useEffect(() => {
        let isMounted = true;

        homeSectionsService.list().then(() => {
            if (!isMounted) {
                return;
            }

            setIsLoading(false);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);

        await homeSectionsService.list();

        setIsRefreshing(false);
    }, []);

    const onOpenSectionsModal = useCallback(() => {
        setDraftSections(normalizedSections);
        setIsSectionsModalVisible(true);
    }, [normalizedSections]);

    const onCloseSectionsModal = useCallback(() => {
        setIsSectionsModalVisible(false);
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
                key: 'events',
                title: localization.t('home.events'),
                description: localization.t('home.sectionOptionDescription'),
                isSelected: getIsDraftSelected('events'),
                onPress: onToggleEvents,
            },
            {
                key: 'choose_wine',
                title: localization.t('home.chooseWine'),
                description: localization.t('home.sectionOptionDescription'),
                isSelected: getIsDraftSelected('choose_wine'),
                onPress: onToggleChooseWine,
            },
            {
                key: 'people_talking',
                title: localization.t('home.peopleTalking'),
                description: localization.t('home.sectionOptionDescription'),
                isSelected: getIsDraftSelected('people_talking'),
                onPress: onTogglePeopleTalking,
            },
        ];
    }, [getIsDraftSelected, onToggleChooseWine, onToggleEvents, onTogglePeopleTalking]);

    const onSaveSections = useCallback(async () => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        const normalizedDraft = getNormalizedSections(draftSections);
        const payloadSections = normalizedDraft.map(section => {
            const defaultSection = getDefaultSection(section.key);

            return {
                key: section.key,
                sortOrder: defaultSection?.sortOrder ?? section.sortOrder,
                isVisible: section.isVisible,
            };
        });

        const response = await homeSectionsService.update({
            sections: payloadSections,
        });

        if (!response.isError) {
            if (!Array.isArray(response.data)) {
                homeSectionsModel.sections = normalizedDraft;
            }

            setIsSectionsModalVisible(false);
        }

        setIsSaving(false);
    }, [draftSections, isSaving]);

    return {
        visibleSections,
        visibleSectionItems,
        hasVisibleSections,
        sectionOptions,
        isLoading,
        isRefreshing,
        isSaving,
        isSectionsModalVisible,
        onRefresh,
        onOpenSectionsModal,
        onCloseSectionsModal,
        onSaveSections,
    };
};
