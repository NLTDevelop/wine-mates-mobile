import { View, TouchableOpacity, TextInput } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { PlusIcon } from '@assets/icons/PlusIcon';
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
        handleButtonPress,
        handleCancel,
        handleConfirm,
        handleInputChange,
    } = useCustomVintageFooter({ existingYears, onAddVintage });

    if (isInputMode) {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, error ? styles.inputError : null]}
                        value={inputValue}
                        onChangeText={handleInputChange}
                        placeholder="YYYY"
                        keyboardType="number-pad"
                        maxLength={4}
                        autoFocus
                    />
                    <TouchableOpacity style={styles.iconButton} onPress={handleConfirm}>
                        <TickIcon />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleCancel}>
                        <CrossIcon />
                    </TouchableOpacity>
                </View>
                {error ? <Typography text={error} variant="body_400" style={styles.errorText} /> : null}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                <Typography text={t('wine.customVintage')} variant="body_500" />
            </TouchableOpacity>
        </View>
    );
};
