import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';
import { CountryPickerBottomSheet } from '@/libs/countryCodePicker/components/CountryPickerBottomSheet';
import { useCountrySelector } from '@/modules/registration/presenters/useCountrySelector';
import { ICountry } from '@/libs/countryCodePicker/types/ICountry';

interface IProps {
    country: ICountry | null
    onChangeCountry: (country: ICountry) => void
}

export const CountrySelector = ({ country, onChangeCountry }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { countryModalRef, handleClose, handlePress, isOpened, handleCountryPress } = useCountrySelector(onChangeCountry);

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={handlePress}>
                <Typography variant="h6" text={country?.name || t('registration.country')} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
            <CountryPickerBottomSheet
                modalRef={countryModalRef}
                handleCountryPress={handleCountryPress}
                handleClose={handleClose}
            />
        </>
    );
};
