import { useCallback, useEffect, useRef, useState } from 'react';
import * as RNLocalize from 'react-native-localize';
import { getExampleNumber, CountryCode } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import countries from 'world-countries';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ICountry } from '../types/ICountry';
import { useUiContext } from '@/UIProvider';

interface IProps  {
    onChangeText: (value: string) => void,
    clearPhone?: () => void,
    onChangeCountryCode?: (code: string) => void,
    initialCca2?: CountryCode | null,
}

export const usePhoneInputField = ({ onChangeText, clearPhone, onChangeCountryCode, initialCca2 = null }: IProps) => {
    const { locale } = useUiContext();
    const normalizedLocale = (locale || 'en').toLowerCase().replace('_', '-');
    const languageCode = normalizedLocale.split('-')[0] || 'en';
    const regionByLanguage: Partial<Record<string, CountryCode>> = {
        uk: 'UA',
        en: 'US',
    };
    const defaultRegion = regionByLanguage[languageCode] || (RNLocalize.getCountry() as CountryCode) || 'US';

    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
    const [isPickerMounted, setIsPickerMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [maxLength, setMaxLength] = useState<number>(15);
    const countryModalRef = useRef<BottomSheetModal>(null);
    const pendingCountryRef = useRef<ICountry | null>(null);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const detectCountry = async () => {
            try {
                const localeCountry = initialCca2 || defaultRegion;
                const matched = countries.find(c => c.cca2.toLowerCase() === localeCountry.toLowerCase());

                const fallback = { name: 'Ukraine', cca2: 'UA' as CountryCode, callingCode: '+380' };
                const country = matched
                    ? {
                          name:
                              matched.translations?.[languageCode]?.common ||
                              matched.translations?.eng?.common ||
                              matched.name.common,
                          cca2: matched.cca2 as CountryCode,
                          callingCode: `${matched.idd?.root || ''}${matched.idd?.suffixes?.[0] || ''}`,
                      }
                    : fallback;

                setSelectedCountry(country);
                const example = getExampleNumber(country.cca2, examples);
                setMaxLength(example?.nationalNumber?.length || 15);
            } catch {
                setSelectedCountry({ name: 'Ukraine', cca2: 'UA', callingCode: '+380' });
                setMaxLength(9);
            } finally {
                setLoading(false);
            }
        };
        detectCountry();
    }, [defaultRegion, initialCca2, languageCode]);

    useEffect(() => {
        if (selectedCountry?.callingCode && onChangeCountryCode) {
            onChangeCountryCode(selectedCountry.callingCode);
        }
    }, [selectedCountry?.callingCode, onChangeCountryCode]);

    const onPhoneChange = useCallback(
        (text: string) => {
            if (!selectedCountry) return;
            let cleaned = text.replace(/[^\d+]/g, '');
            const callingCode = selectedCountry.callingCode.replace('+', '');
            if (cleaned === `+${callingCode}`) cleaned = '';
            onChangeText(cleaned.replace(/\D/g, ''));
        },
        [selectedCountry, onChangeText],
    );

    const onCountryCodePress = useCallback(() => {
        setIsPickerMounted(true);
        setVisible(true);
    }, []);

    const onCountryPress = useCallback(
        (item: ICountry) => {
            pendingCountryRef.current = item;
            countryModalRef.current?.dismiss();
        },
        [],
    );

    const onClose = useCallback(() => {
        countryModalRef.current?.dismiss();
    }, []);

    const onDismiss = useCallback(() => {
        setVisible(false);
        setIsPickerMounted(false);
        const pendingCountry = pendingCountryRef.current;

        if (!pendingCountry) {
            return;
        }

        pendingCountryRef.current = null;
        setSelectedCountry({
            name: pendingCountry.name,
            cca2: pendingCountry.cca2,
            callingCode: `${pendingCountry.callingCode}`,
        });
        const example = getExampleNumber(pendingCountry.cca2, examples);
        setMaxLength(example?.nationalNumber?.length || 15);
        clearPhone?.();
    }, [clearPhone]);

    useEffect(() => {
        if (!isPickerMounted || !visible) {
            return undefined;
        }

        frameRef.current = requestAnimationFrame(() => {
            countryModalRef.current?.present();
        });

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [isPickerMounted, visible]);

    return {
        loading, selectedCountry, isPickerMounted, visible, onCountryPress, onPhoneChange, countryModalRef, onCountryCodePress,
        onClose, onDismiss, maxLength,
    };
};
