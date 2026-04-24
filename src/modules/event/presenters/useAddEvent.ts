import { useCallback, useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useValidator } from '@/hooks/useValidator';
import { Currency } from '@/entities/events/enums/Currency';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType } from '@/entities/events/enums/TastingType';
import { ParticipationCondition } from '@/entities/events/enums/ParticipationCondition';
import { Sex } from '@/entities/events/enums/Sex';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { IAddEventDraft } from '../types/IAddEventDraft';

interface IEventForm {
    theme: string;
    description: string;
    restaurantName: string;
    locationLabel: string;
    locationCountry: string;
    location: { latitude: number; longitude: number } | null;
    eventDate: string;
    eventTime: string;
    phoneNumber: string;
    price: string;
    currency: Currency;
    speakerName: string;
    language: string;
    seats: string;
    sex: Sex;
    eventType: EventType;
    tastingType: TastingType;
    participationCondition: ParticipationCondition;
    requiresConfirmation: boolean;
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
    const [eventTypeDraft, setEventTypeDraft] = useState<EventType>(EventType.Tastings);
    const [form, setForm] = useState<IEventForm>({
        theme: '',
        description: '',
        restaurantName: '',
        locationLabel: '',
        locationCountry: '',
        location: null,
        eventDate: '',
        eventTime: '',
        phoneNumber: '',
        price: '',
        currency: Currency.UAH,
        speakerName: '',
        language: 'ua',
        seats: '',
        sex: Sex.All,
        eventType: EventType.Tastings,
        tastingType: TastingType.Regular,
        participationCondition: ParticipationCondition.FixedPrice,
        requiresConfirmation: false,
    });

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

    const onDateSelect = useCallback((date: Date) => {
        const dateStr = formatDateToLocalApi(date);
        setForm(prev => ({ ...prev, eventDate: dateStr }));
    }, []);

    const onTimeSelect = useCallback((date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        setForm(prev => ({ ...prev, eventTime: timeStr }));
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
        setForm(prev => ({ ...prev, language: value }));
    }, []);

    const onChangeSeats = useCallback((value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setForm(prev => ({ ...prev, seats: numericValue }));
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

    const onSelectEventType = useCallback((value: EventType) => {
        setEventTypeDraft(value);
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

    const onLocationPress = useCallback(() => {
        navigation.navigate('LocationPickerView', {
            initialLocation: form.location,
            eventType: form.eventType,
        });
    }, [form.eventType, form.location, navigation]);

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
            eventDate: form.eventDate,
            eventTime: form.eventTime,
            phoneNumber: form.phoneNumber.trim(),
            price: form.price.trim(),
            currency: form.currency,
            speakerName: form.speakerName.trim() || 'Speaker Name',
            language: form.language.trim(),
            seats: form.seats.trim(),
            minAge: 18,
            maxAge: 80,
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
        !validateEmptyString(form.eventDate).isValid ||
        !validateEmptyString(form.eventTime).isValid ||
        !validateEmptyString(form.phoneNumber.trim()).isValid ||
        !validateEmptyString(form.price.trim()).isValid ||
        !validateEmptyString(form.seats.trim()).isValid;

    return {
        form,
        eventTypeDraft,
        isLoading: false,
        isEventTypeModalVisible,
        disabled,
        onChangeTheme,
        onChangeDescription,
        onChangeRestaurantName,
        onChangeLocationLabel,
        onChangeLocation,
        onDateSelect,
        onTimeSelect,
        onChangePhoneNumber,
        onChangePrice,
        onChangeSpeakerName,
        onChangeLanguage,
        onChangeSeats,
        onChangeEventType,
        onOpenEventTypeModal,
        onCloseEventTypeModal,
        onSelectEventType,
        onConfirmEventType,
        onLocationPress,
        onSubmit,
    };
};
