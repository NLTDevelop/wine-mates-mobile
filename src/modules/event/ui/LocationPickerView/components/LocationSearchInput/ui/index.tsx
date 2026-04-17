import { useMemo } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { SearchBar } from '@/UIKit/SearchBar';
import { Typography } from '@/UIKit/Typography';
import { IPlaceAutocomplete } from '@/libs/locations/types/IPlaceAutocomplete';
import { LocationIcon } from '@assets/icons/LocationIcon';

interface IProps {
    value: string;
    onChangeText: (text: string) => void;
    suggestions: IPlaceAutocomplete[];
    onSelectSuggestion: (suggestion: IPlaceAutocomplete) => void;
    showSuggestions: boolean;
}

export const LocationSearchInput = ({
    value,
    onChangeText,
    suggestions,
    onSelectSuggestion,
    showSuggestions,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const renderItem = ({ item }: { item: IPlaceAutocomplete }) => (
        <TouchableOpacity style={styles.suggestionItem} onPress={() => onSelectSuggestion(item)}>
            <LocationIcon width={16} height={16} color={colors.icon} />
            <View style={styles.suggestionTextContainer}>
                <Typography text={item.mainText} variant="body_500" style={styles.mainText} />
                {item.secondaryText ? (
                    <Typography text={item.secondaryText} variant="body_400" style={styles.secondaryText} />
                ) : null}
            </View>
        </TouchableOpacity>
    );

    const keyExtractor = (item: IPlaceAutocomplete) => item.placeId;

    return (
        <View style={styles.container}>
            <SearchBar
                value={value}
                onChangeText={onChangeText}
                placeholder={t('event.searchLocation')}
                containerStyle={styles.searchBar}
            />
            {showSuggestions && suggestions.length > 0 ? (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={suggestions}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            ) : null}
        </View>
    );
};
