import { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useValidator } from '@/hooks/useValidator';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType } from '@/entities/events/enums/TastingType';
import { PARTICIPATION_CONDITIONS, ParticipationCondition } from '@/entities/events/enums/ParticipationCondition';
import { Sex } from '@/entities/events/enums/Sex';
import { paymentsService } from '@/entities/payments/PaymentsService';
import { eventsService } from '@/entities/events/EventsService';
import { IPaymentsListItem } from '@/entities/payments/types/IPaymentsListItem';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { localization } from '@/UIProvider/localization/Localization';
import { IAddEventDraft } from '../types/IAddEventDraft';
import { ICurrencyOption } from '../types/ICurrencyOption';
import { IPaymentMethodOption } from '../types/IPaymentMethodOption';

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
    phoneNumber: string;
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
    requiresConfirmation: boolean;
    paymentMethodIds: number[];
}

const formatDateToLocalApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const useAddEvent = () => {
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();
    const route = useRoute<RouteProp<EventStackParamList, 'AddEventView'>>();
    const { validateEmptyString } = useValidator();
    const [isEventTypeModalVisible, setIsEventTypeModalVisible] = useState(false);
    const [isSexModalVisible, setIsSexModalVisible] = useState(false);
    const [isParticipationConditionModalVisible, setIsParticipationConditionModalVisible] = useState(false);
    const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
    const [isPaymentMethodsModalVisible, setIsPaymentMethodsModalVisible] = useState(false);
    const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(false);
    const [isCurrenciesLoading, setIsCurrenciesLoading] = useState(false);
    const [eventTypeDraft, setEventTypeDraft] = useState<EventType>(EventType.Tastings);
    const [sexDraft, setSexDraft] = useState<Sex | undefined>(undefined);
    const [participationConditionDraft, setParticipationConditionDraft] = useState<ParticipationCondition | undefined>(undefined);
    const [currencyDraft, setCurrencyDraft] = useState('');
    const [paymentMethods, setPaymentMethods] = useState<IPaymentsListItem[]>([]);
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [paymentMethodDraftIds, setPaymentMethodDraftIds] = useState<number[]>([]);
    const [form, setForm] = useState<IEventForm>({
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
        phoneNumber: '',
        price: '',
        currency: '',
        speakerName: '',
        language: 'ua',
        seats: '',
        sex: undefined,
        eventType: EventType.Tastings,
        tastingType: TastingType.Regular,
        participationCondition: undefined,
        requiresConfirmation: false,
        minAge: 18,
        maxAge: 80,
        paymentMethodIds: [],
    });

    const isPartyEventType = form.eventType === EventType.Parties;

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

    const onLoadCurrencies = useCallback(async () => {
        try {
            setIsCurrenciesLoading(true);
            const response = await eventsService.getCurrencies();

            if (!response.isError && Array.isArray(response.data)) {
                setCurrencies(response.data);
            }
        } catch (error) {
            console.warn('useAddEvent -> onLoadCurrencies: ', error);
        } finally {
            setIsCurrenciesLoading(false);
        }
    }, []);

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

    const onChangeLocationLabel = useCallback((value: string) => {
        setForm(prev => ({ ...prev, locationLabel: value }));
    }, []);

    const onChangeLocation = useCallback((latitude: number, longitude: number, label: string, placeName?: string, countryName?: string) => {
        setForm(prev => ({ 
            ...prev, 
            location: { latitude, longitude }, 
            locationLabel: label,
            locationCountry: countryName || '',
        }));
    }, []);

    const onStartDateSelect = useCallback((date: Date) => {
        const dateStr = formatDateToLocalApi(date);
        setForm(prev => ({ ...prev, eventStartDate: dateStr }));
    }, []);

    const onEndDateSelect = useCallback((date: Date) => {
        const dateStr = formatDateToLocalApi(date);
        setForm(prev => ({ ...prev, eventEndDate: dateStr }));
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

    const onChangePhoneNumber = useCallback((value: string) => {
        setForm(prev => ({ ...prev, phoneNumber: value }));
    }, []);

    const onChangePrice = useCallback((value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setForm(prev => ({ ...prev, price: numericValue }));
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
        setForm(prev => ({ ...prev, seats: numericValue }));
    }, []);

    const onAgeRangeChange = useCallback((minAge: number, maxAge: number) => {
        setForm(prev => ({ ...prev, minAge, maxAge }));
    }, []);

    const onChangeEventType = useCallback((value: EventType) => {
        setForm(prev => ({ ...prev, eventType: value }));
    }, []);

    const onOpenEventTypeModal = useCallback(() => {
        setEventTypeDraft(form.eventType);
        setIsEventTypeModalVisible(true);
    }, [form.eventType]);

    const onCloseEventTypeModal = useCallback(() => {
        setIsEventTypeModalVisible(false);
    }, []);

    const onOpenSexModal = useCallback(() => {
        setSexDraft(form.sex);
        setIsSexModalVisible(true);
    }, [form.sex]);

    const onCloseSexModal = useCallback(() => {
        setIsSexModalVisible(false);
    }, []);

    const onOpenParticipationConditionModal = useCallback(() => {
        setParticipationConditionDraft(form.participationCondition);
        setIsParticipationConditionModalVisible(true);
    }, [form.participationCondition]);

    const onCloseParticipationConditionModal = useCallback(() => {
        setIsParticipationConditionModalVisible(false);
    }, []);

    const onOpenCurrencyModal = useCallback(() => {
        setCurrencyDraft(form.currency);
        setIsCurrencyModalVisible(true);
    }, [form.currency]);

    const onCloseCurrencyModal = useCallback(() => {
        setIsCurrencyModalVisible(false);
    }, []);

    const onOpenPaymentMethodsModal = useCallback(() => {
        setPaymentMethodDraftIds(form.paymentMethodIds);
        setIsPaymentMethodsModalVisible(true);
    }, [form.paymentMethodIds]);

    const onClosePaymentMethodsModal = useCallback(() => {
        setIsPaymentMethodsModalVisible(false);
    }, []);

    const onSelectEventType = useCallback((value: EventType) => {
        setEventTypeDraft(value);
    }, []);

    const onSelectSex = useCallback((value: Sex) => {
        setSexDraft(value);
    }, []);

    const onSelectParticipationCondition = useCallback((value: ParticipationCondition) => {
        setParticipationConditionDraft(value);
    }, []);

    const onSelectCurrency = useCallback((value: string) => {
        setCurrencyDraft(value);
    }, []);

    const onConfirmEventType = useCallback(() => {
        setIsEventTypeModalVisible(false);

        requestAnimationFrame(() => {
            setForm((prev) => {
                if (prev.eventType === eventTypeDraft) {
                    return prev;
                }

                return { ...prev, eventType: eventTypeDraft };
            });
        });
    }, [eventTypeDraft]);

    const onConfirmSex = useCallback(() => {
        setIsSexModalVisible(false);

        requestAnimationFrame(() => {
            setForm(prev => ({ ...prev, sex: sexDraft || prev.sex }));
        });
    }, [sexDraft]);

    const createOnSelectParticipationCondition = useCallback((value: ParticipationCondition) => {
        return () => {
            onSelectParticipationCondition(value);
        };
    }, [onSelectParticipationCondition]);

    const participationConditionItems = useMemo(() => {
        return PARTICIPATION_CONDITIONS.map((value) => {
            return {
                value,
                label: value === ParticipationCondition.FixedPrice
                    ? localization.t('event.participationConditionFixedPrice')
                    : value === ParticipationCondition.SplitBill
                        ? localization.t('event.participationConditionSplitBill')
                        : value === ParticipationCondition.Free
                            ? localization.t('event.participationConditionFree')
                            : value === ParticipationCondition.Charity
                                ? localization.t('event.participationConditionCharity')
                                : value === ParticipationCondition.Host
                                    ? localization.t('event.participationConditionHost')
                                    : localization.t('event.participationConditionGuest'),
                onPress: createOnSelectParticipationCondition(value),
            };
        });
    }, [createOnSelectParticipationCondition]);

    const onConfirmParticipationCondition = useCallback(() => {
        setIsParticipationConditionModalVisible(false);

        requestAnimationFrame(() => {
            setForm(prev => ({ ...prev, participationCondition: participationConditionDraft || prev.participationCondition }));
        });
    }, [participationConditionDraft]);

    const createOnSelectCurrency = useCallback((value: string) => {
        return () => {
            onSelectCurrency(value);
        };
    }, [onSelectCurrency]);

    const currencyItems = useMemo<ICurrencyOption[]>(() => {
        return currencies.map((value) => {
            return {
                value,
                label: value,
                onPress: createOnSelectCurrency(value),
            };
        });
    }, [createOnSelectCurrency, currencies]);

    const onConfirmCurrency = useCallback(() => {
        setIsCurrencyModalVisible(false);

        requestAnimationFrame(() => {
            setForm(prev => ({ ...prev, currency: currencyDraft }));
        });
    }, [currencyDraft]);

    const selectedSexText = useMemo(() => {
        if (!form.sex) {
            return localization.t('eventFilters.selectSex');
        }

        if (form.sex === Sex.Men) {
            return localization.t('eventFilters.men');
        }

        if (form.sex === Sex.Women) {
            return localization.t('eventFilters.women');
        }

        return localization.t('eventFilters.all');
    }, [form.sex]);

    const selectedParticipationConditionText = useMemo(() => {
        if (!form.participationCondition) {
            return localization.t('event.participationCondition');
        }

        if (form.participationCondition === ParticipationCondition.FixedPrice) {
            return localization.t('event.participationConditionFixedPrice');
        }

        if (form.participationCondition === ParticipationCondition.SplitBill) {
            return localization.t('event.participationConditionSplitBill');
        }

        if (form.participationCondition === ParticipationCondition.Free) {
            return localization.t('event.participationConditionFree');
        }

        if (form.participationCondition === ParticipationCondition.Charity) {
            return localization.t('event.participationConditionCharity');
        }

        if (form.participationCondition === ParticipationCondition.Host) {
            return localization.t('event.participationConditionHost');
        }

        return localization.t('event.participationConditionGuest');
    }, [form.participationCondition]);

    const selectedCurrencyText = useMemo(() => {
        return form.currency || '';
    }, [form.currency]);

    const createOnTogglePaymentMethod = useCallback((id: number) => {
        return () => {
            setPaymentMethodDraftIds(prev => {
                if (prev.includes(id)) {
                    return prev.filter(item => item !== id);
                }

                return [...prev, id];
            });
        };
    }, []);

    const paymentMethodOptions = useMemo<IPaymentMethodOption[]>(() => {
        return paymentMethods.map(item => ({
            id: item.id,
            name: item.name,
            isSelected: paymentMethodDraftIds.includes(item.id),
            onPress: createOnTogglePaymentMethod(item.id),
        }));
    }, [createOnTogglePaymentMethod, paymentMethodDraftIds, paymentMethods]);

    const selectedPaymentMethodsText = useMemo(() => {
        const selectedPaymentMethods = paymentMethods.filter(item => form.paymentMethodIds.includes(item.id));
        const [firstPaymentMethod, secondPaymentMethod] = selectedPaymentMethods;

        if (!firstPaymentMethod) {
            return '';
        }

        if (!secondPaymentMethod) {
            return firstPaymentMethod.name;
        }

        if (selectedPaymentMethods.length === 2) {
            return `${firstPaymentMethod.name}, ${secondPaymentMethod.name}`;
        }

        return `${firstPaymentMethod.name}, ${secondPaymentMethod.name} +${selectedPaymentMethods.length - 2}`;
    }, [form.paymentMethodIds, paymentMethods]);

    const onConfirmPaymentMethods = useCallback(() => {
        setIsPaymentMethodsModalVisible(false);

        requestAnimationFrame(() => {
            setForm(prev => ({ ...prev, paymentMethodIds: paymentMethodDraftIds }));
        });
    }, [paymentMethodDraftIds]);

    const onLocationPress = useCallback(() => {
        navigation.navigate('LocationPickerView', {
            initialLocation: form.location,
            eventType: form.eventType,
        });
    }, [form.eventType, form.location, navigation]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            onLoadPaymentMethods();
            onLoadCurrencies();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [onLoadCurrencies, onLoadPaymentMethods]);

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

        const draft: IAddEventDraft = {
            theme: form.theme.trim(),
            description: form.description.trim() || 'Event description',
            restaurantName: form.restaurantName.trim(),
            locationLabel: form.locationLabel.trim() || `${form.location.latitude.toFixed(4)}, ${form.location.longitude.toFixed(4)}`,
            locationCountry: form.locationCountry,
            location: form.location,
            eventStartDate: form.eventStartDate,
            eventEndDate: form.eventEndDate,
            eventStartTime: form.eventStartTime,
            eventEndTime: form.eventEndTime,
            phoneNumber: form.phoneNumber.trim(),
            paymentMethodIds: form.paymentMethodIds,
            price: form.price.trim(),
            currency: form.currency,
            speakerName: form.speakerName.trim() || 'Speaker Name',
            language: form.language.trim(),
            seats: form.seats.trim(),
            minAge: form.minAge,
            maxAge: form.maxAge,
            sex: form.sex,
            eventType: form.eventType,
            tastingType: form.tastingType,
            participationCondition: form.participationCondition,
            requiresConfirmation: form.requiresConfirmation,
        };

        navigation.navigate('AddWineSetView', { draft });
    }, [form, navigation]);

    const disabled = 
        !validateEmptyString(form.theme.trim()).isValid ||
        !validateEmptyString(form.restaurantName.trim()).isValid ||
        !form.location ||
        !validateEmptyString(form.eventStartDate).isValid ||
        !validateEmptyString(form.eventEndDate).isValid ||
        !validateEmptyString(form.eventStartTime).isValid ||
        !validateEmptyString(form.eventEndTime).isValid ||
        !validateEmptyString(form.phoneNumber.trim()).isValid ||
        form.paymentMethodIds.length === 0 ||
        !validateEmptyString(form.price.trim()).isValid ||
        !validateEmptyString(form.currency.trim()).isValid ||
        (isPartyEventType && !form.sex) ||
        (isPartyEventType && !form.participationCondition) ||
        !validateEmptyString(form.seats.trim()).isValid;

    return {
        form,
        eventTypeDraft,
        isLoading: false,
        isEventTypeModalVisible,
        isSexModalVisible,
        isParticipationConditionModalVisible,
        isCurrencyModalVisible,
        isPaymentMethodsModalVisible,
        isPaymentMethodsLoading,
        isCurrenciesLoading,
        isPartyEventType,
        sexDraft,
        participationConditionDraft,
        currencyDraft,
        selectedSexText,
        selectedParticipationConditionText,
        selectedCurrencyText,
        participationConditionItems,
        currencyItems,
        paymentMethodOptions,
        selectedPaymentMethodsText,
        disabled,
        onChangeTheme,
        onChangeDescription,
        onChangeRestaurantName,
        onChangeLocationLabel,
        onChangeLocation,
        onStartDateSelect,
        onEndDateSelect,
        onStartTimeSelect,
        onEndTimeSelect,
        onChangePhoneNumber,
        onChangePrice,
        onChangeSpeakerName,
        onChangeLanguage,
        onChangeSeats,
        onAgeRangeChange,
        onChangeEventType,
        onOpenEventTypeModal,
        onCloseEventTypeModal,
        onSelectEventType,
        onConfirmEventType,
        onOpenSexModal,
        onCloseSexModal,
        onSelectSex,
        onConfirmSex,
        onOpenParticipationConditionModal,
        onCloseParticipationConditionModal,
        onConfirmParticipationCondition,
        onOpenCurrencyModal,
        onCloseCurrencyModal,
        onConfirmCurrency,
        onOpenPaymentMethodsModal,
        onClosePaymentMethodsModal,
        onConfirmPaymentMethods,
        onLocationPress,
        onSubmit,
    };
};
