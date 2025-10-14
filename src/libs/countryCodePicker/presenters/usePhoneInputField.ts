import { useCallback, useEffect, useRef, useState } from 'react';
import * as RNLocalize from 'react-native-localize';
import { getExampleNumber, CountryCode } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import countries from 'world-countries';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ICountry } from '../types/ICountry';

export const usePhoneInputField = (onChangeText: (value: string) => void, clearPhone?: () => void) => {
    const lang = RNLocalize.getLocales()[0]?.languageCode || 'en';
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const countryModalRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        const detectCountry = async () => {
            try {
                const localeCountry = RNLocalize.getCountry() || 'US';
                const matched = countries.find(c => c.cca2.toLowerCase() === localeCountry.toLowerCase());

                if (matched) {
                    const code =
                        matched.idd?.root && matched.idd?.suffixes
                            ? `${matched.idd.root}${matched.idd.suffixes[0]}`
                            : '';

                    setSelectedCountry({
                        name:
                            matched.translations?.[lang]?.common ||
                            matched.translations?.eng?.common ||
                            matched.name.common,
                        cca2: matched.cca2 as CountryCode,
                        callingCode: `${code}`,
                    });
                } else {
                    setSelectedCountry({
                        name: 'Ukraine',
                        cca2: 'UA',
                        callingCode: '+380',
                    });
                }
            } catch {
                setSelectedCountry({
                    name: 'Ukraine',
                    cca2: 'UA',
                    callingCode: '+380',
                });
            } finally {
                setLoading(false);
            }
        };

        detectCountry();
    }, [lang]);

    const getMaxDigits = useCallback((countryCode: CountryCode): number => {
        try {
            const example = getExampleNumber(countryCode, examples);
            return example?.nationalNumber?.length || 15;
        } catch {
            return 15;
        }
    }, []);

    const handlePhoneChange = useCallback(
        (text: string) => {
            if (!selectedCountry) return;

            let cleaned = text.replace(/[^\d+]/g, '');

            const callingCode = selectedCountry.callingCode.replace('+', '');

            if (cleaned === `+${callingCode}`) {
                cleaned = '';
            }

            const maxDigits = getMaxDigits(selectedCountry.cca2);
            const digitsOnly = cleaned.replace(/\D/g, '').slice(0, maxDigits);

            onChangeText(digitsOnly);
        },
        [selectedCountry, onChangeText, getMaxDigits],
    );

    const handleCountryCodePress = useCallback(() => {
        setVisible(true);
        countryModalRef.current?.present();
    }, []);

    const handleCountryPress = useCallback((item: ICountry) => {
        setSelectedCountry({
            name: item.name,
            cca2: item.cca2,
            callingCode: `${item.callingCode}`,
        });
        clearPhone?.();
        setVisible(false);
        countryModalRef.current?.dismiss();
    }, [clearPhone]);

    const handleClose = useCallback(() => {
        setVisible(false);
        countryModalRef.current?.dismiss();
    }, []);

    return {
        loading, selectedCountry, visible, handleCountryPress, handlePhoneChange, countryModalRef,
        handleCountryCodePress, handleClose,
    };
};
