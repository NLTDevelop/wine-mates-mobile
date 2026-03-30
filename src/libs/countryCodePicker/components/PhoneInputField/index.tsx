import { useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import Flag from 'react-native-round-flags';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { CustomInput } from '@/UIKit/CustomInput';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { CountryPickerBottomSheet } from '../CountryPickerBottomSheet';
import { usePhoneInputField } from '@/libs/countryCodePicker/presenters/usePhoneInputField';

interface IProps {
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    editable?: boolean;
    clearPhone?: () => void;
    onChangeCountryCode?: (code: string) => void;
    initialCca2?: string | null;
}

export const PhoneInputField = ({ value, onChangeText, placeholder, editable = true, clearPhone, onChangeCountryCode, initialCca2 = null }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { loading, selectedCountry, visible, handleCountryPress, handlePhoneChange, countryModalRef, maxLength,
        handleCountryCodePress, handleClose } = usePhoneInputField({ onChangeText, clearPhone, onChangeCountryCode, initialCca2: initialCca2 as any });

    return (
        <>
            {loading || !selectedCountry ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color={colors.text_light} />
                </View>
            ) : (
                <View style={styles.container}>
                    <TouchableOpacity
                        disabled={!editable}
                        style={styles.pickerButton}
                        onPressIn={Keyboard.dismiss}
                        onPress={handleCountryCodePress}
                    >
                        <Flag code={selectedCountry.cca2} style={styles.flag} />
                        <Typography variant="h6" style={styles.codeText}>
                            {selectedCountry.callingCode}
                        </Typography>
                        <ArrowDownIcon width={16} height={16} rotate={visible ? 180 : 0} strokeWidth={2} />
                    </TouchableOpacity>
                    <CustomInput
                        value={value}
                        onChangeText={handlePhoneChange}
                        placeholder={placeholder || ''}
                        keyboardType="phone-pad"
                        placeholderTextColor={colors.text_light}
                        containerStyle={styles.input}
                        editable={editable}
                        maxLength={maxLength}
                    />
                </View>
            )}
            <CountryPickerBottomSheet
                modalRef={countryModalRef}
                handleCountryPress={handleCountryPress}
                handleClose={handleClose}
                showCountryCode
            />
        </>
    );
};
