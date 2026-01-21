import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
        }
    });
    return styles;
};
