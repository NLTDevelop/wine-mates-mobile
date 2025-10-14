import { useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Flag from 'react-native-round-flags';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { scaleVertical } from '@/utils';
import { getStyles } from './styles';
import { usePhoneInputField } from '@/modules/registration/presenters/usePhoneInputField';
import { CustomInput } from '@/UIKit/CustomInput';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';
import { CountryPickerBottomSheet } from '../CountryPickerBottomSheet';

interface IProps {
    value: string;
    onChangeText: (value: string) => void;
    errorText?: string;
    placeholder?: string;
    editable?: boolean;
}

export const PhoneInputField = ({ value, onChangeText, errorText, placeholder, editable = true }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { loading, selectedCountry, visible, handleCountryPress, formatPhone, countryModalRef, handleCountryCodePress,
        handleClose } = usePhoneInputField(onChangeText);

    if (loading || !selectedCountry) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator color={colors.text_light} />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity disabled={!editable} style={styles.pickerButton} onPress={handleCountryCodePress}>
                    <Flag code={selectedCountry.cca2} style={styles.flag} />
                    <Typography variant="h6" style={styles.codeText}>
                        {selectedCountry.callingCode}
                    </Typography>
                    <ArrowDownIcon width={16} height={16} rotate={visible ? 180 : 0} strokeWidth={2} />
                </TouchableOpacity>
                <CustomInput
                    value={value}
                    onChangeText={formatPhone}
                    placeholder={placeholder}
                    keyboardType="phone-pad"
                    placeholderTextColor={colors.text_light}
                    containerStyle={styles.input}
                />
            </View>

            {errorText ? (
                <Typography
                    variant="body_500"
                    style={{
                        color: colors.error,
                        marginTop: scaleVertical(4),
                    }}
                >
                    {errorText}
                </Typography>
            ) : null}

            <CountryPickerBottomSheet modalRef={countryModalRef} handleCountryPress={handleCountryPress} handleClose={handleClose}/>
        </>
    );
};
