import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            position: 'relative',
            zIndex: 2,
        },
        searchBar: {
            backgroundColor: colors.background,
        },
        suggestionsContainer: {
            position: 'absolute',
            bottom: scaleVertical(56),
            left: 0,
            right: 0,
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            maxHeight: scaleVertical(200),
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },
        suggestionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(12),
            gap: scaleHorizontal(12),
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        suggestionTextContainer: {
            flex: 1,
            gap: scaleVertical(2),
        },
        mainText: {
            color: colors.text,
        },
        secondaryText: {
            color: colors.text_light,
            fontSize: 12,
        },
    });
    return styles;
};
