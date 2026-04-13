import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useValidator } from '@/hooks/useValidator';
import { eventService } from '@/entities/events/EventService';
import { Currency } from '@/entities/events/enums/Currency';
import { RepeatRule } from '@/entities/events/enums/RepeatRule';
import { EventTastingType } from '@/entities/events/enums/EventTastingType';
import { Sex } from '@/entities/events/enums/Sex';

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
    tastingType: EventTastingType;
    requiresConfirmation: boolean;
    repeatRule: RepeatRule;
}

export const useAddEvent = () => {
    const navigation = useNavigation();
    const { validateEmptyString } = useValidator();
    const [isLoading, setIsLoading] = useState(false);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
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
        tastingType: EventTastingType.WineSet,
        requiresConfirmation: true,
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

    const onChangeLocation = useCallback((latitude: number, longitude: number, label: string) => {
        setForm(prev => ({ ...prev, location: { latitude, longitude }, locationLabel: label }));
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

    const onLocationPress = useCallback(() => {
        setIsLocationModalVisible(true);
    }, []);

    const onCloseLocationModal = useCallback(() => {
        setIsLocationModalVisible(false);
    }, []);

    const onSubmit = useCallback(async () => {
        if (!form.location) return;

        try {
            setIsLoading(true);
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
                tastingType: form.tastingType,
                requiresConfirmation: form.requiresConfirmation,
                repeatRule: form.repeatRule,
                wineSet: [],
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
        disabled,
        isLocationModalVisible,
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
        onLocationPress,
        onCloseLocationModal,
        onSubmit,
    };
};
