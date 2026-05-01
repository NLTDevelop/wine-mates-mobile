import { useMemo } from 'react';
import { getStyles } from './styles';
import { Keyboard, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { CountryPickerBottomSheet } from '@/libs/countryCodePicker/components/CountryPickerBottomSheet';
import { useCountrySelector } from '@/libs/countryCodePicker/presenters/useCountrySelector';
import { ICountry } from '@/libs/countryCodePicker/types/ICountry';

interface IProps {
    country: ICountry | null
    onChangeCountry: (country: ICountry) => void
}

export const CountrySelector = ({ country, onChangeCountry }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { countryModalRef, onClose, onDismiss, onPress, isMounted, isOpened, onCountryPress } = useCountrySelector(onChangeCountry);

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={onPress} onPressIn={Keyboard.dismiss}>
                <Typography variant="h6" text={country?.name || t('registration.country')} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
            {isMounted && (
                <CountryPickerBottomSheet
                    modalRef={countryModalRef}
                    onCountryPress={onCountryPress}
                    onClose={onClose}
                    onDismiss={onDismiss}
                />
            )}
        </>
    );
};
