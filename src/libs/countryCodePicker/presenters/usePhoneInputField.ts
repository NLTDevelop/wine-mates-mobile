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
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [maxLength, setMaxLength] = useState<number>(15);
    const countryModalRef = useRef<BottomSheetModal>(null);

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

    const handlePhoneChange = useCallback(
        (text: string) => {
            if (!selectedCountry) return;
            let cleaned = text.replace(/[^\d+]/g, '');
            const callingCode = selectedCountry.callingCode.replace('+', '');
            if (cleaned === `+${callingCode}`) cleaned = '';
            onChangeText(cleaned.replace(/\D/g, ''));
        },
        [selectedCountry, onChangeText],
    );

    const handleCountryCodePress = useCallback(() => {
        setVisible(true);
        countryModalRef.current?.present();
    }, []);

    const handleCountryPress = useCallback(
        (item: ICountry) => {
            setSelectedCountry({
                name: item.name,
                cca2: item.cca2,
                callingCode: `${item.callingCode}`,
            });
            const example = getExampleNumber(item.cca2, examples);
            setMaxLength(example?.nationalNumber?.length || 15);
            clearPhone?.();
            setVisible(false);
            countryModalRef.current?.dismiss();
        },
        [clearPhone],
    );

    const handleClose = useCallback(() => {
        setVisible(false);
        countryModalRef.current?.dismiss();
    }, []);

    return {
        loading, selectedCountry, visible, handleCountryPress, handlePhoneChange, countryModalRef, handleCountryCodePress,
        handleClose, maxLength,
    };
};
