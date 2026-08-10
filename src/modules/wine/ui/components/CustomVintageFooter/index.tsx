import { View, TouchableOpacity, TextInput } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { TickIcon } from '@assets/icons/TickIcon';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useCustomVintageFooter } from './useCustomVintageFooter';

interface IProps {
    existingYears: number[];
    onAddVintage: (year: number) => void;
}

export const CustomVintageFooter = ({ existingYears, onAddVintage }: IProps) => {
    const {
        isInputMode,
        inputValue,
        error,
        styles,
        t,
        onButtonPress,
        onCancel,
        onConfirm,
        onInputChange,
    } = useCustomVintageFooter({ existingYears, onAddVintage });

    if (isInputMode) {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, error ? styles.inputError : null]}
                        value={inputValue}
                        onChangeText={onInputChange}
                        placeholder="YYYY"
                        keyboardType="number-pad"
                        maxLength={4}
                        autoFocus
                    />
                    <TouchableOpacity style={styles.iconButton} onPress={onConfirm}>
                        <TickIcon />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={onCancel}>
                        <CrossIcon />
                    </TouchableOpacity>
                </View>
                {error ? <Typography text={error} variant="body_400" style={styles.errorText} /> : null}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onButtonPress}>
                <Typography text={t('wine.customVintage')} variant="body_500" />
            </TouchableOpacity>
        </View>
    );
};
