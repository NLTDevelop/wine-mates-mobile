import { useCallback, useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useValidator } from '@/hooks/useValidator';
import { eventService } from '@/entities/events/EventService';
import { Currency } from '@/entities/events/enums/Currency';
import { RepeatRule } from '@/entities/events/enums/RepeatRule';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType } from '@/entities/events/enums/TastingType';
import { ParticipationCondition } from '@/entities/events/enums/ParticipationCondition';
import { Sex } from '@/entities/events/enums/Sex';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';

interface IEventForm {
    theme: string;
    description: string;
    restaurantName: string;
    locationLabel: string;
    location: { latitude: number; longitude: number } | null;
    eventDate: string;
    eventTime: string;
    phoneNumber: string;
    price: string;
    currency: Currency;
    speakerName: string;
    language: string;
    seats: string;
    age: string;
    sex: Sex;
    eventType: EventType;
    tastingType: TastingType;
    participationCondition: ParticipationCondition;
    requiresConfirmation: boolean;
    repeatRule: RepeatRule;
}

export const useAddEvent = () => {
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();
    const route = useRoute<RouteProp<EventStackParamList, 'AddEventView'>>();
    const { validateEmptyString } = useValidator();
    const [isLoading, setIsLoading] = useState(false);
    const [isEventTypeModalVisible, setIsEventTypeModalVisible] = useState(false);
    const [form, setForm] = useState<IEventForm>({
        theme: '',
        description: '',
        restaurantName: '',
        locationLabel: '',
        location: null,
        eventDate: '',
        eventTime: '',
        phoneNumber: '',
        price: '',
        currency: Currency.UAH,
        speakerName: '',
        language: 'ua',
        seats: '',
        age: '18',
        sex: Sex.All,
        eventType: EventType.Tastings,
        tastingType: TastingType.Regular,
        participationCondition: ParticipationCondition.FixedPrice,
        requiresConfirmation: false,
        repeatRule: RepeatRule.Never,
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

    const onChangeLocation = useCallback((latitude: number, longitude: number, label: string, placeName?: string) => {
        setForm(prev => ({ 
            ...prev, 
            location: { latitude, longitude }, 
            locationLabel: label,
            restaurantName: placeName || prev.restaurantName,
        }));
    }, []);

    const onDateSelect = useCallback((date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
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
        setIsEventTypeModalVisible(true);
    }, []);

    const onCloseEventTypeModal = useCallback(() => {
        setIsEventTypeModalVisible(false);
    }, []);

    const onSelectEventType = useCallback((value: EventType) => {
        onChangeEventType(value);
        setIsEventTypeModalVisible(false);
    }, [onChangeEventType]);

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

        onChangeLocation(
            pickedLocation.latitude,
            pickedLocation.longitude,
            pickedLocation.label,
            pickedLocation.placeName,
        );

        navigation.setParams({ pickedLocation: undefined });
    }, [navigation, onChangeLocation, route.params?.pickedLocation]);

    const onSubmit = useCallback(async () => {
        if (!form.location) return;

        try {
            setIsLoading(true);
            // TODO: Implement wine selection functionality
            const response = await eventService.createEvent({
                theme: form.theme,
                description: form.description || 'Event description',
                restaurantName: form.restaurantName,
                locationLabel: form.locationLabel || `${form.location.latitude.toFixed(4)}, ${form.location.longitude.toFixed(4)}`,
                latitude: form.location.latitude,
                longitude: form.location.longitude,
                eventDate: form.eventDate,
                eventTime: form.eventTime,
                price: Number(form.price),
                currency: form.currency,
                speakerName: form.speakerName || 'Speaker Name',
                language: form.language,
                seats: Number(form.seats),
                phoneNumber: form.phoneNumber,
                age: Number(form.age),
                sex: form.sex,
                eventType: form.eventType,
                tastingType: form.tastingType,
                participationCondition: form.participationCondition,
                requiresConfirmation: form.requiresConfirmation,
                repeatRule: form.repeatRule,
                wineSet: [
                    { wineId: 204, sortOrder: 1 },
                    { wineId: 203, sortOrder: 2 },
                    { wineId: 202, sortOrder: 3 },
                ],
            });

            if (!response.isError) {
                navigation.goBack();
            }
        } catch (error) {
            console.warn('useAddEvent -> onSubmit: ', error);
        } finally {
            setIsLoading(false);
        }
    }, [form, navigation]);

    const disabled = 
        !validateEmptyString(form.theme).isValid ||
        !validateEmptyString(form.restaurantName).isValid ||
        !form.location ||
        !validateEmptyString(form.eventDate).isValid ||
        !validateEmptyString(form.eventTime).isValid ||
        !validateEmptyString(form.phoneNumber).isValid ||
        !validateEmptyString(form.price).isValid ||
        !validateEmptyString(form.seats).isValid;

    return {
        form,
        isLoading,
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
        onLocationPress,
        onSubmit,
    };
};
