import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DateData } from 'react-native-calendars';
import { RouteProp, useRoute } from '@react-navigation/native';
import { format, isValid, parseISO } from 'date-fns';
import { eventsModel } from '@/entities/events/EventsModel';
import { eventsService } from '@/entities/events/EventsService';
import { userModel } from '@/entities/users/UserModel';
import { locationModel } from '@/entities/location/LocationModel';
import { Sex } from '@/entities/events/enums/Sex';
import { EventType } from '@/entities/events/enums/EventType';
import { IEventFilterOptions, IEventFilterOptionsRequest } from '@/entities/events/types/IEventFilterOptions';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { IEventFilters } from '@/modules/event/types/IEventFilters';
import { IRadiusOption } from '@/modules/event/ui/EventFiltersView/types/IRadiusOption';
import { getCurrencySymbol } from '@/modules/event/utils/formatEventPrice';
import { getRangeMarkedDates } from '@/modules/event/utils/getRangeMarkedDates';
import { IQuickFilterButtonItem } from '@/modules/chooseWine/types/IQuickFilterButtonItem';

type RouteParams = {
    EventFiltersView: {
        searchLocation?: IUserLocation | null;
        selectedEventType?: EventType;
    };
};

interface IProps {
    t: ILocalization['t'];
}

const DATE_API_FORMAT = 'yyyy-MM-dd';
const DATE_DISPLAY_FORMAT = 'dd.MM.yyyy';
const RADIUS_OPTIONS = [1, 5, 10, 50];
const DEFAULT_RADIUS_KM = 50;
const MIN_AGE_LIMIT = 18;
const MAX_AGE_LIMIT = 100;
const DEFAULT_MIN_PRICE_LIMIT = 0;
const DEFAULT_MAX_PRICE_LIMIT = 500;
const DEFAULT_PRICE_CURRENCY_SUFFIX = '$';
const DEFAULT_FILTER_LOCATION = {
    latitude: 50.4501,
    longitude: 30.5234,
};

const EMPTY_FILTER_OPTIONS: IEventFilterOptions = {
    eventTypes: [],
    sexOptions: [],
};

const parseDate = (value?: string | null) => {
    if (!value) {
        return null;
    }

    const parsedDate = parseISO(value);

    if (!isValid(parsedDate)) {
        return null;
    }

    return parsedDate;
};

const getDateRange = (filterOptions: IEventFilterOptions) => {
    const minDate = filterOptions.dateRange?.minDate || undefined;
    const maxDate = filterOptions.dateRange?.maxDate || undefined;

    return {
        minDate,
        maxDate,
    };
};

const isDateRangeAvailable = (filterOptions: IEventFilterOptions) => {
    return !!filterOptions.dateRange?.minDate && !!filterOptions.dateRange?.maxDate;
};

const isAgeRangeAvailable = (filterOptions: IEventFilterOptions) => {
    return typeof filterOptions.ageRange?.maxAge === 'number';
};

const isPriceRangeAvailable = (filterOptions: IEventFilterOptions) => {
    return typeof filterOptions.priceRange?.minPrice === 'number' &&
        typeof filterOptions.priceRange?.maxPrice === 'number';
};

const isSexOptionsAvailable = (filterOptions: IEventFilterOptions) => {
    return filterOptions.sexOptions.length > 0;
};

const getRoundedAgeRange = (filterOptions: IEventFilterOptions) => {
    const minAge = filterOptions.ageRange?.minAge;
    const maxAge = filterOptions.ageRange?.maxAge;
    const roundedMinAge = typeof minAge === 'number' && Number.isFinite(minAge)
        ? Math.round(minAge)
        : MIN_AGE_LIMIT;
    const roundedMaxAge = typeof maxAge === 'number' && Number.isFinite(maxAge)
        ? Math.round(maxAge)
        : MAX_AGE_LIMIT;

    return {
        minAge: Math.min(Math.max(roundedMinAge, MIN_AGE_LIMIT), MAX_AGE_LIMIT),
        maxAge: Math.min(Math.max(roundedMaxAge, roundedMinAge), MAX_AGE_LIMIT),
    };
};

const getRoundedPriceRange = (filterOptions: IEventFilterOptions) => {
    const minPrice = filterOptions.priceRange?.minPrice;
    const maxPrice = filterOptions.priceRange?.maxPrice;
    const roundedMinPrice = typeof minPrice === 'number' && Number.isFinite(minPrice)
        ? Math.floor(minPrice)
        : DEFAULT_MIN_PRICE_LIMIT;
    const roundedMaxPrice = typeof maxPrice === 'number' && Number.isFinite(maxPrice)
        ? Math.ceil(maxPrice)
        : DEFAULT_MAX_PRICE_LIMIT;
    const normalizedMinPrice = Math.max(DEFAULT_MIN_PRICE_LIMIT, roundedMinPrice);

    return {
        minPrice: normalizedMinPrice,
        maxPrice: Math.max(normalizedMinPrice, roundedMaxPrice),
    };
};

const getTargetLocation = (routeLocation?: IUserLocation | null) => {
    return routeLocation || locationModel.userLocation || DEFAULT_FILTER_LOCATION;
};

const isDateInRange = (date: string, dateRange: { minDate?: string; maxDate?: string }) => {
    if (dateRange.minDate && date < dateRange.minDate) {
        return false;
    }

    if (dateRange.maxDate && date > dateRange.maxDate) {
        return false;
    }

    return true;
};

const isAgeFilterSelected = (
    filters: IEventFilters,
    ageRange: { minAge: number; maxAge: number },
) => {
    if (typeof filters.minAge !== 'number' || typeof filters.maxAge !== 'number') {
        return false;
    }

    return filters.minAge !== ageRange.minAge || filters.maxAge !== ageRange.maxAge;
};

const isPriceFilterSelected = (
    filters: IEventFilters,
    priceRange: { minPrice: number; maxPrice: number },
) => {
    if (typeof filters.minPrice !== 'number' || typeof filters.maxPrice !== 'number') {
        return false;
    }

    return filters.minPrice !== priceRange.minPrice || filters.maxPrice !== priceRange.maxPrice;
};

const isSexOptionAvailable = (filterOptions: IEventFilterOptions, sex: Sex) => {
    return filterOptions.sexOptions.some(item => item.value === sex);
};

const getSexTitle = (sex: Sex, t: ILocalization['t']) => {
    if (sex === Sex.Men) {
        return t('eventFilters.men');
    }

    if (sex === Sex.Women) {
        return t('eventFilters.women');
    }

    return t('eventFilters.all');
};

const createCountSubtitle = (eventCount?: number) => {
    if (typeof eventCount !== 'number') {
        return undefined;
    }

    return `${eventCount}`;
};

const createQuickFilterTitle = (title: string, eventCount?: number) => {
    const subtitle = createCountSubtitle(eventCount);

    if (!subtitle) {
        return title;
    }

    return `${title} (${subtitle})`;
};

const removeEmptyFiltersFromRequest = (
    request: IEventFilterOptionsRequest,
): IEventFilterOptionsRequest => {
    const nextRequest = { ...request };

    if (!nextRequest.eventStartDate) {
        delete nextRequest.eventStartDate;
    }

    if (!nextRequest.eventEndDate) {
        delete nextRequest.eventEndDate;
    }

    if (!nextRequest.sex) {
        delete nextRequest.sex;
    }

    return nextRequest;
};

const createFilterOptionsRequest = (
    filters: IEventFilters,
    location: IUserLocation,
    selectedEventType?: EventType,
): IEventFilterOptionsRequest => {
    return removeEmptyFiltersFromRequest({
        latitude: location.latitude,
        longitude: location.longitude,
        radiusKm: filters.radiusKm ?? DEFAULT_RADIUS_KM,
        eventStartDate: filters.eventStartDate,
        eventEndDate: filters.eventEndDate,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sex: filters.sex,
        minAge: filters.minAge,
        maxAge: filters.maxAge,
        eventType: selectedEventType,
    });
};

export const useEventFiltersView = ({ t }: IProps) => {
    const route = useRoute<RouteProp<RouteParams, 'EventFiltersView'>>();
    const routeLocation = route.params?.searchLocation;
    const selectedEventType = route.params?.selectedEventType;
    const targetLocation = getTargetLocation(routeLocation);
    const priceCurrencySuffix = getCurrencySymbol(userModel.user?.selectedCurrency) || DEFAULT_PRICE_CURRENCY_SUFFIX;
    const initialFilters = eventsModel.eventFilters;
    const initialDate = parseDate(initialFilters.eventStartDate);
    const initialMinAge = initialFilters.minAge ?? MIN_AGE_LIMIT;
    const initialMaxAge = initialFilters.maxAge ?? MAX_AGE_LIMIT;
    const initialMinPrice = initialFilters.minPrice ?? DEFAULT_MIN_PRICE_LIMIT;
    const initialMaxPrice = initialFilters.maxPrice ?? DEFAULT_MAX_PRICE_LIMIT;
    const requestIdRef = useRef(0);

    const [filterOptions, setFilterOptions] = useState<IEventFilterOptions>(EMPTY_FILTER_OPTIONS);
    const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(initialFilters.radiusKm ?? DEFAULT_RADIUS_KM);
    const [selectedStartDate, setSelectedStartDate] = useState(initialFilters.eventStartDate || '');
    const [selectedEndDate, setSelectedEndDate] = useState(initialFilters.eventEndDate || '');
    const [selectedSex, setSelectedSex] = useState<Sex | undefined>(initialFilters.sex);
    const [selectedMinAge, setSelectedMinAge] = useState<number>(initialMinAge);
    const [selectedMaxAge, setSelectedMaxAge] = useState<number>(initialMaxAge);
    const [selectedMinPrice, setSelectedMinPrice] = useState<number>(initialMinPrice);
    const [selectedMaxPrice, setSelectedMaxPrice] = useState<number>(initialMaxPrice);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(
        initialDate ? format(initialDate, DATE_API_FORMAT) : format(new Date(), DATE_API_FORMAT),
    );

    const ageRange = getRoundedAgeRange(filterOptions);
    const priceRange = getRoundedPriceRange(filterOptions);
    const dateRange = getDateRange(filterOptions);
    const isDateDisabled = !isDateRangeAvailable(filterOptions);
    const isAgeDisabled = !isAgeRangeAvailable(filterOptions);
    const isPriceDisabled = !isPriceRangeAvailable(filterOptions);
    const isSexDisabled = !isSexOptionsAvailable(filterOptions);

    const loadFilterOptions = useCallback(
        async (filters: IEventFilters) => {
            requestIdRef.current += 1;
            const requestId = requestIdRef.current;
            const response = await eventsService.getFilterOptions(
                createFilterOptionsRequest(filters, targetLocation, selectedEventType),
            );

            if (requestId !== requestIdRef.current || response.isError || !response.data) {
                return;
            }

            const nextFilterOptions = response.data;
            const nextAgeRange = getRoundedAgeRange(nextFilterOptions);
            const nextPriceRange = getRoundedPriceRange(nextFilterOptions);
            const nextDateRange = getDateRange(nextFilterOptions);
            const isNextDateDisabled = !isDateRangeAvailable(nextFilterOptions);
            const isNextAgeDisabled = !isAgeRangeAvailable(nextFilterOptions);
            const isNextPriceDisabled = !isPriceRangeAvailable(nextFilterOptions);
            const isNextSexDisabled = !isSexOptionsAvailable(nextFilterOptions);
            const shouldKeepAgeFilter = isAgeFilterSelected(filters, nextAgeRange);
            const shouldKeepPriceFilter = isPriceFilterSelected(filters, nextPriceRange);
            const nextFilters = { ...filters };

            if (isNextDateDisabled) {
                delete nextFilters.eventStartDate;
                delete nextFilters.eventEndDate;
                setSelectedStartDate('');
                setSelectedEndDate('');
            } else if (
                nextFilters.eventStartDate &&
                !isDateInRange(nextFilters.eventStartDate, nextDateRange)
            ) {
                delete nextFilters.eventStartDate;
                delete nextFilters.eventEndDate;
                setSelectedStartDate('');
                setSelectedEndDate('');
            } else if (
                nextFilters.eventEndDate &&
                !isDateInRange(nextFilters.eventEndDate, nextDateRange)
            ) {
                delete nextFilters.eventStartDate;
                delete nextFilters.eventEndDate;
                setSelectedStartDate('');
                setSelectedEndDate('');
            } else {
                setSelectedStartDate(nextFilters.eventStartDate || '');
                setSelectedEndDate(nextFilters.eventEndDate || '');
            }

            if (isNextSexDisabled) {
                delete nextFilters.sex;
                setSelectedSex(undefined);
            } else if (nextFilters.sex && !isSexOptionAvailable(nextFilterOptions, nextFilters.sex)) {
                delete nextFilters.sex;
                setSelectedSex(undefined);
            }

            if (isNextAgeDisabled) {
                delete nextFilters.minAge;
                delete nextFilters.maxAge;
                setSelectedMinAge(nextAgeRange.minAge);
                setSelectedMaxAge(nextAgeRange.maxAge);
            } else if (shouldKeepAgeFilter) {
                const nextMinAge = Math.min(
                    Math.max(filters.minAge || nextAgeRange.minAge, nextAgeRange.minAge),
                    nextAgeRange.maxAge,
                );
                const nextMaxAge = Math.min(
                    Math.max(filters.maxAge || nextAgeRange.maxAge, nextMinAge),
                    nextAgeRange.maxAge,
                );

                nextFilters.minAge = nextMinAge;
                nextFilters.maxAge = nextMaxAge;
                setSelectedMinAge(nextMinAge);
                setSelectedMaxAge(nextMaxAge);
            } else {
                delete nextFilters.minAge;
                delete nextFilters.maxAge;
                setSelectedMinAge(nextAgeRange.minAge);
                setSelectedMaxAge(nextAgeRange.maxAge);
            }

            if (isNextPriceDisabled) {
                delete nextFilters.minPrice;
                delete nextFilters.maxPrice;
                setSelectedMinPrice(nextPriceRange.minPrice);
                setSelectedMaxPrice(nextPriceRange.maxPrice);
            } else if (shouldKeepPriceFilter) {
                const nextMinPrice = Math.min(
                    Math.max(filters.minPrice || nextPriceRange.minPrice, nextPriceRange.minPrice),
                    nextPriceRange.maxPrice,
                );
                const nextMaxPrice = Math.min(
                    Math.max(filters.maxPrice || nextPriceRange.maxPrice, nextMinPrice),
                    nextPriceRange.maxPrice,
                );

                nextFilters.minPrice = nextMinPrice;
                nextFilters.maxPrice = nextMaxPrice;
                setSelectedMinPrice(nextMinPrice);
                setSelectedMaxPrice(nextMaxPrice);
            } else {
                delete nextFilters.minPrice;
                delete nextFilters.maxPrice;
                setSelectedMinPrice(nextPriceRange.minPrice);
                setSelectedMaxPrice(nextPriceRange.maxPrice);
            }

            eventsModel.setEventFilters(nextFilters);
            setFilterOptions(nextFilterOptions);
        },
        [
            selectedEventType,
            setFilterOptions,
            setSelectedEndDate,
            setSelectedMaxAge,
            setSelectedMaxPrice,
            setSelectedMinAge,
            setSelectedMinPrice,
            setSelectedSex,
            setSelectedStartDate,
            targetLocation,
        ],
    );

    const onSyncFilters = useCallback(
        (nextFilters: IEventFilters) => {
            eventsModel.setEventFilters(nextFilters);
            loadFilterOptions(nextFilters);
        },
        [loadFilterOptions],
    );

    useEffect(() => {
        let isActive = true;

        const syncFilterOptions = async () => {
            await loadFilterOptions(eventsModel.eventFilters);

            if (isActive) {
                setIsInitialLoading(false);
            }
        };

        syncFilterOptions();

        return () => {
            isActive = false;
        };
    }, [loadFilterOptions]);

    const getPreparedFilters = useCallback((
        radiusKm?: number,
        eventStartDate?: string,
        eventEndDate?: string,
        sex?: Sex,
        minAge?: number,
        maxAge?: number,
        minPrice?: number,
        maxPrice?: number,
    ) => {
        const nextFilters: IEventFilters = {};

        if (typeof radiusKm === 'number') {
            nextFilters.radiusKm = radiusKm;
        }

        if (eventStartDate) {
            nextFilters.eventStartDate = eventStartDate;
            nextFilters.eventEndDate = eventEndDate || eventStartDate;
        }

        if (sex) {
            nextFilters.sex = sex;
        }

        if (typeof minAge === 'number' && typeof maxAge === 'number') {
            nextFilters.minAge = minAge;
            nextFilters.maxAge = maxAge;
        }

        if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
            nextFilters.minPrice = minPrice;
            nextFilters.maxPrice = maxPrice;
        }

        return nextFilters;
    }, []);

    const onOpenCalendar = useCallback(() => {
        if (isDateDisabled) {
            return;
        }

        setIsCalendarVisible(true);
    }, [isDateDisabled, setIsCalendarVisible]);

    const onCloseCalendar = useCallback(() => {
        setIsCalendarVisible(false);
    }, [setIsCalendarVisible]);

    const onSelectRadius = useCallback((value: number) => {
        if (selectedRadiusKm === value) {
            return;
        }

        const nextFilters = getPreparedFilters(
            value,
            eventsModel.eventFilters.eventStartDate,
            eventsModel.eventFilters.eventEndDate,
            selectedSex,
            eventsModel.eventFilters.minAge,
            eventsModel.eventFilters.maxAge,
            eventsModel.eventFilters.minPrice,
            eventsModel.eventFilters.maxPrice,
        );

        setSelectedRadiusKm(value);
        onSyncFilters(nextFilters);
    }, [getPreparedFilters, onSyncFilters, selectedRadiusKm, selectedSex, setSelectedRadiusKm]);

    const getRadiusOption = useCallback((value: number): IRadiusOption => {
        return {
            value,
            isSelected: selectedRadiusKm === value,
            onPress: () => onSelectRadius(value),
        };
    }, [onSelectRadius, selectedRadiusKm]);

    const radiusOption1 = useMemo(() => {
        return getRadiusOption(RADIUS_OPTIONS[0]);
    }, [getRadiusOption]);

    const radiusOption5 = useMemo(() => {
        return getRadiusOption(RADIUS_OPTIONS[1]);
    }, [getRadiusOption]);

    const radiusOption10 = useMemo(() => {
        return getRadiusOption(RADIUS_OPTIONS[2]);
    }, [getRadiusOption]);

    const radiusOption50 = useMemo(() => {
        return getRadiusOption(RADIUS_OPTIONS[3]);
    }, [getRadiusOption]);

    const onDayPress = useCallback((item: DateData) => {
        const nextDate = item.dateString;
        let nextStartDate = nextDate;
        let nextEndDate = nextDate;

        if (selectedStartDate && selectedEndDate && selectedStartDate === selectedEndDate) {
            if (nextDate === selectedStartDate) {
                nextStartDate = '';
                nextEndDate = '';
            } else if (nextDate > selectedStartDate) {
                nextStartDate = selectedStartDate;
            }
        } else if (selectedStartDate && selectedEndDate) {
            nextStartDate = nextDate;
            nextEndDate = nextDate;
        } else if (selectedStartDate) {
            if (nextDate < selectedStartDate) {
                nextStartDate = nextDate;
                nextEndDate = selectedStartDate;
            } else {
                nextStartDate = selectedStartDate;
                nextEndDate = nextDate;
            }
        }

        const nextFilters = getPreparedFilters(
            selectedRadiusKm,
            nextStartDate,
            nextEndDate,
            selectedSex,
            eventsModel.eventFilters.minAge,
            eventsModel.eventFilters.maxAge,
            eventsModel.eventFilters.minPrice,
            eventsModel.eventFilters.maxPrice,
        );

        setSelectedStartDate(nextStartDate);
        setSelectedEndDate(nextEndDate);
        setCurrentMonth(nextDate);
        onSyncFilters(nextFilters);
    }, [
        getPreparedFilters,
        onSyncFilters,
        selectedEndDate,
        selectedRadiusKm,
        selectedSex,
        selectedStartDate,
        setCurrentMonth,
        setSelectedEndDate,
        setSelectedStartDate,
    ]);

    const onSelectSex = useCallback((sex: Sex) => {
        if (isSexDisabled) {
            return;
        }

        const nextSex = selectedSex === sex ? undefined : sex;
        const nextFilters = getPreparedFilters(
            selectedRadiusKm,
            eventsModel.eventFilters.eventStartDate,
            eventsModel.eventFilters.eventEndDate,
            nextSex,
            eventsModel.eventFilters.minAge,
            eventsModel.eventFilters.maxAge,
            eventsModel.eventFilters.minPrice,
            eventsModel.eventFilters.maxPrice,
        );

        setSelectedSex(nextSex);
        onSyncFilters(nextFilters);
    }, [
        getPreparedFilters,
        isSexDisabled,
        onSyncFilters,
        selectedRadiusKm,
        selectedSex,
        setSelectedSex,
    ]);

    const sexFilterItems = useMemo<IQuickFilterButtonItem[]>(() => {
        if (isSexDisabled) {
            return [];
        }

        return filterOptions.sexOptions.map(item => {
            return {
                id: item.value,
                title: createQuickFilterTitle(getSexTitle(item.value, t), item.eventCount),
                isSelected: selectedSex === item.value,
                onPress: () => onSelectSex(item.value),
            };
        });
    }, [filterOptions.sexOptions, isSexDisabled, onSelectSex, selectedSex, t]);

    const onAgeRangeChange = useCallback((minAge: number, maxAge: number) => {
        if (isAgeDisabled) {
            return;
        }

        if (selectedMinAge === minAge && selectedMaxAge === maxAge) {
            return;
        }

        const nextMinAge = minAge === ageRange.minAge && maxAge === ageRange.maxAge ? undefined : minAge;
        const nextMaxAge = minAge === ageRange.minAge && maxAge === ageRange.maxAge ? undefined : maxAge;
        const nextFilters = getPreparedFilters(
            selectedRadiusKm,
            eventsModel.eventFilters.eventStartDate,
            eventsModel.eventFilters.eventEndDate,
            selectedSex,
            nextMinAge,
            nextMaxAge,
            eventsModel.eventFilters.minPrice,
            eventsModel.eventFilters.maxPrice,
        );

        setSelectedMinAge(minAge);
        setSelectedMaxAge(maxAge);
        onSyncFilters(nextFilters);
    }, [
        ageRange.maxAge,
        ageRange.minAge,
        getPreparedFilters,
        isAgeDisabled,
        onSyncFilters,
        selectedMaxAge,
        selectedMinAge,
        selectedRadiusKm,
        selectedSex,
        setSelectedMaxAge,
        setSelectedMinAge,
    ]);

    const onPriceRangeChange = useCallback((minPrice: number, maxPrice: number) => {
        if (isPriceDisabled) {
            return;
        }

        if (selectedMinPrice === minPrice && selectedMaxPrice === maxPrice) {
            return;
        }

        const nextMinPrice = minPrice === priceRange.minPrice && maxPrice === priceRange.maxPrice ? undefined : minPrice;
        const nextMaxPrice = minPrice === priceRange.minPrice && maxPrice === priceRange.maxPrice ? undefined : maxPrice;
        const nextFilters = getPreparedFilters(
            selectedRadiusKm,
            eventsModel.eventFilters.eventStartDate,
            eventsModel.eventFilters.eventEndDate,
            selectedSex,
            eventsModel.eventFilters.minAge,
            eventsModel.eventFilters.maxAge,
            nextMinPrice,
            nextMaxPrice,
        );

        setSelectedMinPrice(minPrice);
        setSelectedMaxPrice(maxPrice);
        onSyncFilters(nextFilters);
    }, [
        getPreparedFilters,
        isPriceDisabled,
        onSyncFilters,
        priceRange.maxPrice,
        priceRange.minPrice,
        selectedMaxPrice,
        selectedMinPrice,
        selectedRadiusKm,
        selectedSex,
        setSelectedMaxPrice,
        setSelectedMinPrice,
    ]);

    const onMonthChange = useCallback((month: DateData) => {
        setCurrentMonth(month.dateString);
    }, [setCurrentMonth]);

    const onReset = useCallback(() => {
        setSelectedRadiusKm(DEFAULT_RADIUS_KM);
        setSelectedStartDate('');
        setSelectedEndDate('');
        setSelectedSex(undefined);
        setSelectedMinAge(ageRange.minAge);
        setSelectedMaxAge(ageRange.maxAge);
        setSelectedMinPrice(priceRange.minPrice);
        setSelectedMaxPrice(priceRange.maxPrice);
        setCurrentMonth(dateRange.minDate || format(new Date(), DATE_API_FORMAT));
        onSyncFilters({});
    }, [
        ageRange.maxAge,
        ageRange.minAge,
        dateRange.minDate,
        onSyncFilters,
        priceRange.maxPrice,
        priceRange.minPrice,
        setCurrentMonth,
        setSelectedEndDate,
        setSelectedMaxAge,
        setSelectedMaxPrice,
        setSelectedMinAge,
        setSelectedMinPrice,
        setSelectedRadiusKm,
        setSelectedSex,
        setSelectedStartDate,
    ]);

    const markedDates = useMemo(() => {
        return getRangeMarkedDates(selectedStartDate, selectedEndDate);
    }, [selectedEndDate, selectedStartDate]);

    const selectedDateText = useMemo(() => {
        if (!selectedStartDate) {
            return '';
        }

        const startDate = parseDate(selectedStartDate);
        const endDate = parseDate(selectedEndDate);
        const formattedStartDate = startDate ? format(startDate, DATE_DISPLAY_FORMAT) : selectedStartDate;
        const formattedEndDate = endDate ? format(endDate, DATE_DISPLAY_FORMAT) : selectedEndDate;

        if (!selectedEndDate || selectedEndDate === selectedStartDate) {
            return formattedStartDate;
        }

        return `${formattedStartDate} - ${formattedEndDate}`;
    }, [selectedEndDate, selectedStartDate]);

    const isResetDisabled = useMemo(() => {
        return !selectedStartDate
            && typeof selectedRadiusKm !== 'number'
            && !selectedSex
            && !isAgeFilterSelected(eventsModel.eventFilters, ageRange)
            && !isPriceFilterSelected(eventsModel.eventFilters, priceRange);
    }, [ageRange, priceRange, selectedRadiusKm, selectedSex, selectedStartDate]);

    return {
        currentMonth,
        markedDates,
        selectedDateText,
        sexFilterItems,
        selectedMinAge,
        selectedMaxAge,
        selectedMinPrice,
        selectedMaxPrice,
        priceCurrencySuffix,
        minAgeLimit: MIN_AGE_LIMIT,
        maxAgeLimit: MAX_AGE_LIMIT,
        allowedAgeMin: ageRange.minAge,
        allowedAgeMax: ageRange.maxAge,
        minPriceLimit: priceRange.minPrice,
        maxPriceLimit: priceRange.maxPrice,
        allowedPriceMin: priceRange.minPrice,
        allowedPriceMax: priceRange.maxPrice,
        calendarMinDate: dateRange.minDate,
        calendarMaxDate: dateRange.maxDate,
        radiusOption1,
        radiusOption5,
        radiusOption10,
        radiusOption50,
        isCalendarVisible,
        isResetDisabled,
        isInitialLoading,
        isDateDisabled,
        isAgeDisabled,
        isPriceDisabled,
        isSexDisabled,
        onOpenCalendar,
        onCloseCalendar,
        onDayPress,
        onMonthChange,
        onAgeRangeChange,
        onPriceRangeChange,
        onReset,
    };
};
