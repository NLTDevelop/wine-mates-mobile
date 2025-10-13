import { useState } from 'react';
import { Country, CountryCode } from 'react-native-country-picker-modal';

export const usePhoneInput = () => {
    const [countryCode, setCountryCode] = useState<CountryCode>('UA');
    const [callingCode, setCallingCode] = useState('+380');
    const [visible, setVisible] = useState(false);

    const onSelect = (country: Country) => {
        setCountryCode(country.cca2);
        setCallingCode(`+${country.callingCode[0]}`);
        setVisible(false);
    };

    return { countryCode, callingCode, visible, onSelect, setVisible };
};
