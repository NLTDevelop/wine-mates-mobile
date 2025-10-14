import { useCallback, useEffect, useRef, useState } from 'react';
import * as RNLocalize from 'react-native-localize';
import { AsYouType, CountryCode } from 'libphonenumber-js';
import countries from 'world-countries';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ICountry } from '../types/ICountry';

export const usePhoneInputField = (onChangeText: (value: string) => void) => {
    const lang = RNLocalize.getLocales()[0]?.languageCode || 'eng';
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const countryModalRef = useRef<BottomSheetModal>(null);

    // 🔹 Определение страны (SIM → локаль → fallback)
    useEffect(() => {
        const detectCountry = async () => {
            try {
                // Пытаемся получить страну по системной локали
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

    const formatPhone = (text: string) => {
        if (!selectedCountry) return;
        const formatter = new AsYouType(selectedCountry.cca2);
        onChangeText(formatter.input(text));
    };

    const handleCountryCodePress = useCallback(() => {
        setVisible(true);
        countryModalRef.current?.present();
    }, [countryModalRef]);

    const handleCountryPress = useCallback(
        (item: ICountry) => {
            setSelectedCountry({ name: item.name, cca2: item.cca2, callingCode: `${item.callingCode}` });
            setVisible(false);
            countryModalRef.current?.dismiss();
        },
        [countryModalRef],
    );

    const handleClose = useCallback(() => {
        setVisible(false);
        countryModalRef.current?.dismiss();
    }, [countryModalRef]);

    return {
        loading,
        selectedCountry,
        visible,
        handleCountryPress,
        formatPhone,
        countryModalRef,
        handleCountryCodePress,
        handleClose,
    };
};
