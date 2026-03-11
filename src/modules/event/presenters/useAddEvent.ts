import { useCallback, useState } from 'react';
import { useValidator } from '@/hooks/useValidator';

interface IEventForm {
    tastingTheme: string;
    restaurant: string;
    location: { latitude: number; longitude: number } | null;
    eventDate: string;
    eventTime: string;
    phoneNumber: string;
    price: string;
    eventLanguage: string;
    numberOfSeats: string;
}

export const useAddEvent = () => {
    const { validateEmptyString } = useValidator();
    const [isLoading, setIsLoading] = useState(false);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [form, setForm] = useState<IEventForm>({
        tastingTheme: '',
        restaurant: '',
        location: null,
        eventDate: '',
        eventTime: '',
        phoneNumber: '',
        price: '',
        eventLanguage: '',
        numberOfSeats: '',
    });

    const onChangeTastingTheme = useCallback((value: string) => {
        if (value.length <= 80) {
            setForm(prev => ({ ...prev, tastingTheme: value }));
        }
    }, []);

    const onChangeRestaurant = useCallback((value: string) => {
        if (value.length <= 30) {
            setForm(prev => ({ ...prev, restaurant: value }));
        }
    }, []);

    const onChangeLocation = useCallback((latitude: number, longitude: number) => {
        setForm(prev => ({ ...prev, location: { latitude, longitude } }));
    }, []);

    const onDateSelect = useCallback((date: Date) => {
        const isoString = date.toISOString();
        setForm(prev => ({ ...prev, eventDate: isoString }));
    }, []);

    const onTimeSelect = useCallback((date: Date) => {
        const isoString = date.toISOString();
        setForm(prev => ({ ...prev, eventTime: isoString }));
    }, []);

    const onChangePhoneNumber = useCallback((value: string) => {
        setForm(prev => ({ ...prev, phoneNumber: value }));
    }, []);

    const onChangePrice = useCallback((value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setForm(prev => ({ ...prev, price: numericValue }));
    }, []);

    const onChangeEventLanguage = useCallback((value: string) => {
        setForm(prev => ({ ...prev, eventLanguage: value }));
    }, []);

    const onChangeNumberOfSeats = useCallback((value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setForm(prev => ({ ...prev, numberOfSeats: numericValue }));
    }, []);

    const handleLocationPress = useCallback(() => {
        setIsLocationModalVisible(true);
    }, []);

    const handleCloseLocationModal = useCallback(() => {
        setIsLocationModalVisible(false);
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
            // TODO: Implement event creation logic
            console.log('Creating event:', form);
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
        } finally {
            setIsLoading(false);
        }
    }, [form]);

    const disabled = 
        !validateEmptyString(form.tastingTheme).isValid ||
        !validateEmptyString(form.restaurant).isValid ||
        !form.location ||
        !validateEmptyString(form.eventDate).isValid ||
        !validateEmptyString(form.eventTime).isValid ||
        !validateEmptyString(form.phoneNumber).isValid ||
        !validateEmptyString(form.price).isValid ||
        !validateEmptyString(form.eventLanguage).isValid ||
        !validateEmptyString(form.numberOfSeats).isValid;

    return {
        form,
        isLoading,
        disabled,
        isLocationModalVisible,
        onChangeTastingTheme,
        onChangeRestaurant,
        onChangeLocation,
        onDateSelect,
        onTimeSelect,
        onChangePhoneNumber,
        onChangePrice,
        onChangeEventLanguage,
        onChangeNumberOfSeats,
        handleLocationPress,
        handleCloseLocationModal,
        handleSubmit,
    };
};
