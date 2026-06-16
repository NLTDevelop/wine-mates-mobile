import { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useValidator } from '@/hooks/useValidator';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType } from '@/entities/events/enums/TastingType';
import { ParticipationCondition } from '@/entities/events/enums/ParticipationCondition';
import { Sex } from '@/entities/events/enums/Sex';
import { paymentsService } from '@/entities/payments/PaymentsService';
import { contactsService } from '@/entities/contacts/ContactsService';
import { IPaymentsListItem } from '@/entities/payments/types/IPaymentsListItem';
import { IContactsListItem } from '@/entities/contacts/types/IContactsListItem';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { IAddEventDraft } from '../../../types/IAddEventDraft';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useUserCurrencies } from '@/UIKit/CurrencyPicker/presenters/useUserCurrencies';
import { convertUtcEventDateTimeToLocal } from '@/modules/event/utils/eventDateTimeUtc';
import { addEventWineSetDraftModel } from '@/entities/events/AddEventWineSetDraftModel';

interface IEventForm {
    theme: string;
    description: string;
    restaurantName: string;
    locationLabel: string;
    locationCountry: string;
    location: { latitude: number; longitude: number } | null;
    eventStartDate: string;
    eventEndDate: string;
    eventStartTime: string;
    eventEndTime: string;
    price: string;
    currency: string;
    speakerName: string;
    language: string;
    seats: string;
    minAge: number;
    maxAge: number;
    sex?: Sex;
    eventType: EventType;
    tastingType: TastingType;
    participationCondition?: ParticipationCondition;
    requiresConfirmation?: boolean;
    paymentMethodIds: number[];
    contactIds: number[];
}

const formatDateToLocalApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const normalizeTimeToHoursMinutes = (value?: string) => {
    if (!value) {
        return '';
    }

    const [hours = '', minutes = ''] = value.split(':');
    if (!hours || !minutes) {
        return value;
    }

    return `${hours}:${minutes}`;
};

const getIsPriceFieldAvailable = (value?: ParticipationCondition) => {
    if (!value) {
        return true;
    }

    return (
        value === ParticipationCondition.FixedPrice ||
        value === ParticipationCondition.SplitBill ||
        value === ParticipationCondition.Charity
    );
};

const getInitialForm = (draft?: IAddEventDraft, isEditMode = false): IEventForm => {
    if (!draft) {
        return {
            theme: '',
            description: '',
            restaurantName: '',
            locationLabel: '',
            locationCountry: '',
            location: null,
            eventStartDate: '',
            eventEndDate: '',
            eventStartTime: '',
            eventEndTime: '',
            price: '',
            currency: '',
            speakerName: '',
            language: 'ua',
            seats: '',
            sex: undefined,
            eventType: EventType.Tastings,
            tastingType: TastingType.Regular,
            participationCondition: undefined,
            requiresConfirmation: undefined,
            minAge: 18,
            maxAge: 100,
            paymentMethodIds: [],
            contactIds: [],
        };
    }

    const startDateTime = isEditMode
        ? convertUtcEventDateTimeToLocal(draft.eventStartDate, draft.eventStartTime)
        : { date: '', time: '' };
    const endDateTime = isEditMode
        ? convertUtcEventDateTimeToLocal(draft.eventEndDate, draft.eventEndTime)
        : { date: '', time: '' };

    return {
        theme: draft.theme,
        description: draft.description,
        restaurantName: draft.restaurantName,
        locationLabel: draft.locationLabel,
        locationCountry: draft.locationCountry || '',
        location: draft.location,
        eventStartDate: startDateTime.date,
        eventEndDate: endDateTime.date,
        eventStartTime: normalizeTimeToHoursMinutes(startDateTime.time),
        eventEndTime: normalizeTimeToHoursMinutes(endDateTime.time),
        price: draft.price,
        currency: draft.currency,
        speakerName: draft.speakerName,
        language: draft.language || 'ua',
        seats: draft.seats,
        minAge: draft.minAge,
        maxAge: draft.maxAge,
        sex: draft.sex,
        eventType: draft.eventType,
        tastingType: draft.tastingType,
        participationCondition: draft.participationCondition,
        requiresConfirmation: draft.requiresConfirmation,
        paymentMethodIds: draft.paymentMethodIds,
        contactIds: draft.contactIds,
    };
};

export const useAddEvent = () => {
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();
    const route = useRoute<RouteProp<EventStackParamList, 'AddEventView'>>();
    const { validateEmptyString } = useValidator();
    const isEditMode = typeof route.params?.editEventId === 'number';
    const isDuplicateMode = route.params?.isDuplicateEvent === true;
    const headerTitleKey = useMemo(() => {
        if (isEditMode) {
            return 'event.editEvent';
        }

        if (isDuplicateMode) {
            return 'event.duplicateEvent';
        }

        return 'event.addEvent';
    }, [isDuplicateMode, isEditMode]);

    const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(false);
    const [isContactInfoLoading, setIsContactInfoLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<IPaymentsListItem[]>([]);
    const [contacts, setContacts] = useState<IContactsListItem[]>([]);
    const { currencies, isCurrenciesLoading, onLoadCurrencies } = useUserCurrencies();
    const [isSeatsError, setIsSeatsError] = useState(false);
    const [form, setForm] = useState<IEventForm>(() => getInitialForm(route.params?.draft, isEditMode));

    const isPartyEventType = form.eventType === EventType.Parties;

    const isPriceFieldAvailable = useMemo(() => {
        if (!isPartyEventType) {
            return true;
        }

        return getIsPriceFieldAvailable(form.participationCondition);
    }, [form.participationCondition, isPartyEventType]);

    const isPriceRequired = useMemo(() => {
        if (!isPartyEventType) {
            return true;
        }

        return (
            form.participationCondition === ParticipationCondition.FixedPrice ||
            form.participationCondition === ParticipationCondition.SplitBill
        );
    }, [form.participationCondition, isPartyEventType]);

    const isPriceValid = useMemo(() => {
        if (!isPriceRequired) {
            return true;
        }

        const normalizedPrice = form.price.trim();

        if (!normalizedPrice) {
            return false;
        }

        return Number(normalizedPrice) > 0;
    }, [form.price, isPriceRequired]);
    const isPaymentMethodsDisabled = !isPriceFieldAvailable;
    const isCurrencyDisabled = !isPriceFieldAvailable;

    const onLoadPaymentMethods = useCallback(async () => {
        try {
            setIsPaymentMethodsLoading(true);
            const response = await paymentsService.list();

            if (!response.isError && Array.isArray(response.data)) {
                setPaymentMethods(response.data.filter(item => item.isVisible));
            }
        } catch (error) {
            console.warn('useAddEvent -> onLoadPaymentMethods: ', error);
        } finally {
            setIsPaymentMethodsLoading(false);
        }
    }, []);

    const onLoadContacts = useCallback(async () => {
        try {
            setIsContactInfoLoading(true);
            const response = await contactsService.list({ isVisible: true });

            if (!response.isError && Array.isArray(response.data)) {
                setContacts(response.data);
            }
        } catch (error) {
            console.warn('useAddEvent -> onLoadContacts: ', error);
        } finally {
            setIsContactInfoLoading(false);
        }
    }, []);

    const onLoadEventCurrencies = useCallback(async () => {
        const data = await onLoadCurrencies();

        if (!data) {
            return;
        }

        const availableCurrencies = data.list;
        const selectedCurrency = data.selected;

        setForm(prev => {
            const hasCurrentCurrency = availableCurrencies.includes(prev.currency);

            if (hasCurrentCurrency) {
                return prev;
            }

            if (selectedCurrency && availableCurrencies.includes(selectedCurrency)) {
                return { ...prev, currency: selectedCurrency };
            }

            return { ...prev, currency: availableCurrencies[0] || '' };
        });
    }, [onLoadCurrencies]);

    const onChangeTheme = useCallback((value: string) => {
        if (value.length <= 80) {
            setForm(prev => ({ ...prev, theme: value }));
        }
    }, []);

    const onChangeDescription = useCallback((value: string) => {
        setForm(prev => ({ ...prev, description: value }));
    }, []);

    const onChangeRestaurantName = useCallback((value: string) => {
        if (value.length <= 50) {
            setForm(prev => ({ ...prev, restaurantName: value }));
        }
    }, []);

    const onChangeLocation = useCallback(
        (latitude: number, longitude: number, label: string, placeName?: string, countryName?: string) => {
            setForm(prev => ({
                ...prev,
                location: { latitude, longitude },
                locationLabel: label,
                locationCountry: countryName || '',
            }));
        },
        [],
    );

    const onDateRangeSelect = useCallback((startDate: Date, endDate: Date) => {
        const startDateStr = formatDateToLocalApi(startDate);
        const endDateStr = formatDateToLocalApi(endDate);

        setForm(prev => ({
            ...prev,
            eventStartDate: startDateStr,
            eventEndDate: endDateStr,
            eventEndTime: prev.eventEndDate === endDateStr ? prev.eventEndTime : '',
        }));
    }, []);

    const onStartTimeSelect = useCallback((date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        setForm(prev => ({ ...prev, eventStartTime: timeStr }));
    }, []);

    const onEndTimeSelect = useCallback((date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        setForm(prev => ({ ...prev, eventEndTime: timeStr }));
    }, []);

    const onChangePrice = useCallback((value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const isZeroPrice = numericValue !== '' && Number(numericValue) === 0;

        setForm(prev => ({
            ...prev,
            price: numericValue,
            paymentMethodIds: isZeroPrice ? [] : prev.paymentMethodIds,
        }));
    }, []);

    const onChangeSpeakerName = useCallback((value: string) => {
        setForm(prev => ({ ...prev, speakerName: value }));
    }, []);

    const onChangeLanguage = useCallback((value: string) => {
        const nextLanguage = value.trim().toLowerCase();

        if (!nextLanguage) {
            return;
        }

        setForm(prev => ({ ...prev, language: nextLanguage }));
    }, []);

    const onChangeSeats = useCallback((value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue && Number(numericValue) > 0) {
            setIsSeatsError(false);
        }
        setForm(prev => ({ ...prev, seats: numericValue }));
    }, []);

    const onAgeRangeChange = useCallback((minAge: number, maxAge: number) => {
        setForm(prev => ({ ...prev, minAge, maxAge }));
    }, []);

    const onChangeEventType = useCallback((value: EventType) => {
        setForm(prev => ({ ...prev, eventType: value }));
    }, []);

    const onChangeSex = useCallback((value?: Sex) => {
        setForm(prev => ({ ...prev, sex: value }));
    }, []);

    const onChangeParticipationCondition = useCallback((value?: ParticipationCondition) => {
        const isNextPriceFieldAvailable = getIsPriceFieldAvailable(value);

        setForm(prev => ({
            ...prev,
            participationCondition: value,
            price: isNextPriceFieldAvailable ? prev.price : '',
            paymentMethodIds: isNextPriceFieldAvailable ? prev.paymentMethodIds : [],
        }));
    }, []);

    const onChangeCurrency = useCallback((value: string) => {
        setForm(prev => ({ ...prev, currency: value }));
    }, []);

    const onChangeRequiresConfirmation = useCallback((value?: boolean) => {
        setForm(prev => ({ ...prev, requiresConfirmation: value }));
    }, []);

    const onChangePaymentMethodIds = useCallback((value: number[]) => {
        setForm(prev => ({ ...prev, paymentMethodIds: value }));
    }, []);

    const onChangeContactInfoIds = useCallback((value: number[]) => {
        setForm(prev => ({ ...prev, contactIds: value }));
    }, []);

    const onLocationPress = useCallback(() => {
        navigation.navigate('LocationPickerView', {
            initialLocation: form.location,
            eventType: form.eventType,
            isDuplicateEvent: route.params?.isDuplicateEvent,
        });
    }, [form.eventType, form.location, navigation, route.params?.isDuplicateEvent]);

    const onOpenPaymentsPress = useCallback(() => {
        navigation.navigate('PaymentsView' as never);
    }, [navigation]);

    const onOpenContactsPress = useCallback(() => {
        navigation.navigate('ContactInfoView' as never);
    }, [navigation]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            onLoadPaymentMethods();
            onLoadContacts();
            onLoadEventCurrencies();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [onLoadContacts, onLoadEventCurrencies, onLoadPaymentMethods]);

    useFocusEffect(
        useCallback(() => {
            onLoadPaymentMethods();
            onLoadContacts();
        }, [onLoadContacts, onLoadPaymentMethods]),
    );

    useEffect(() => {
        return () => {
            addEventWineSetDraftModel.state = null;
        };
    }, []);

    useEffect(() => {
        const pickedLocation = route.params?.pickedLocation;

        if (!pickedLocation) {
            return;
        }

        const frameId = requestAnimationFrame(() => {
            onChangeLocation(
                pickedLocation.latitude,
                pickedLocation.longitude,
                pickedLocation.label,
                pickedLocation.placeName,
                pickedLocation.countryName,
            );

            navigation.setParams({ pickedLocation: undefined });
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [navigation, onChangeLocation, route.params?.pickedLocation]);

    const onSubmit = useCallback(() => {
        if (!form.location) {
            return;
        }

        const savedWineSetDraft = addEventWineSetDraftModel.state;
        const seatsValue = Number(form.seats.trim());
        if (!Number.isFinite(seatsValue) || seatsValue < 1) {
            setIsSeatsError(true);
            toastService.showError(localization.t('event.invalidSeatsError'));
            return;
        }

        const draft: IAddEventDraft = {
            theme: form.theme.trim(),
            description: form.description.trim() || 'Event description',
            restaurantName: form.restaurantName.trim(),
            locationLabel:
                form.locationLabel.trim() ||
                `${form.location.latitude.toFixed(4)}, ${form.location.longitude.toFixed(4)}`,
            locationCountry: form.locationCountry,
            location: form.location,
            eventStartDate: form.eventStartDate,
            eventEndDate: form.eventEndDate,
            eventStartTime: form.eventStartTime,
            eventEndTime: form.eventEndTime,
            paymentMethodIds: form.paymentMethodIds,
            contactIds: form.contactIds,
            price: form.price.trim(),
            currency: form.currency,
            speakerName: form.speakerName.trim() || 'Speaker Name',
            language: form.language.trim(),
            seats: form.seats.trim(),
            minAge: form.minAge,
            maxAge: form.maxAge,
            sex: form.sex,
            eventType: form.eventType,
            tastingType: savedWineSetDraft?.tastingType || form.tastingType,
            participationCondition: form.participationCondition,
            requiresConfirmation: !!form.requiresConfirmation,
            repeatRule: savedWineSetDraft ? savedWineSetDraft.repeatRule : route.params?.draft?.repeatRule || null,
        };

        navigation.navigate('AddWineSetView', {
            draft,
            initialSelectedWines: savedWineSetDraft?.selectedWines ?? route.params?.initialSelectedWines,
            editEventId: route.params?.editEventId,
            isDuplicateEvent: route.params?.isDuplicateEvent,
        });
    }, [
        form,
        navigation,
        route.params?.editEventId,
        route.params?.isDuplicateEvent,
        route.params?.initialSelectedWines,
        route.params?.draft?.repeatRule,
    ]);

    const disabled =
        !validateEmptyString(form.theme.trim()).isValid ||
        !validateEmptyString(form.restaurantName.trim()).isValid ||
        !form.location ||
        !validateEmptyString(form.eventStartDate).isValid ||
        !validateEmptyString(form.eventEndDate).isValid ||
        !validateEmptyString(form.eventStartTime).isValid ||
        !validateEmptyString(form.eventEndTime).isValid ||
        (isPriceRequired && form.paymentMethodIds.length === 0) ||
        form.contactIds.length === 0 ||
        !isPriceValid ||
        (isPriceRequired && !validateEmptyString(form.currency.trim()).isValid) ||
        (isPartyEventType && !form.sex) ||
        (isPartyEventType && !form.participationCondition) ||
        !validateEmptyString(form.seats.trim()).isValid;

    return {
        form,
        headerTitleKey,
        isEditMode,
        isLoading: false,
        isPartyEventType,
        isPaymentMethodsLoading,
        isContactInfoLoading,
        isCurrenciesLoading,
        isPaymentMethodsDisabled,
        isCurrencyDisabled,
        isPriceFieldAvailable,
        paymentMethods,
        contacts,
        currencies,
        isSeatsError,
        disabled,
        onChangeTheme,
        onChangeDescription,
        onChangeRestaurantName,
        onDateRangeSelect,
        onStartTimeSelect,
        onEndTimeSelect,
        onChangePrice,
        onChangeSpeakerName,
        onChangeLanguage,
        onChangeSeats,
        onAgeRangeChange,
        onChangeEventType,
        onChangeSex,
        onChangeParticipationCondition,
        onChangeCurrency,
        onChangeRequiresConfirmation,
        onChangePaymentMethodIds,
        onChangeContactInfoIds,
        onLocationPress,
        onOpenPaymentsPress,
        onOpenContactsPress,
        onSubmit,
    };
};
