import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';
import { CountryPickerBottomSheet } from '@/libs/countryCodePicker/components/CountryPickerBottomSheet';
import { useCountrySelector } from '@/modules/registration/presenters/useCountrySelector';

export const CountrySelector = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { countryModalRef, handleClose, handlePress, isOpened, handleCountryPress } = useCountrySelector();

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={handlePress}>
            {/* TODO: add Country text after selection */}
                <Typography variant="h6" text={t('registration.country')} />
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
