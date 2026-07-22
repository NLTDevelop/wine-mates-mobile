import { useMemo } from 'react';
import { View, TextInput, TextInputProps, ViewStyle, TouchableOpacity } from 'react-native';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useSearchBarWithFilter } from './presenters/useSearchBarWithFilter';
import { SearchIcon } from '@assets/icons/SearchIcon';
import { FilterIcon } from '@assets/icons/FilterIcon';

interface IProps extends TextInputProps {
    containerStyle?: ViewStyle;
    onFilterPress: () => void;
    hasActiveFilter?: boolean;
}

export const SearchBarWithFilter = (props: IProps) => {
    const { containerStyle, onFilterPress, hasActiveFilter, ...textInputProps } = props;
    const { onChangeText, value } = textInputProps;
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isFocused, handleFocus, handleBlur, onClearText } = useSearchBarWithFilter(onChangeText);

    return (
        <View style={[styles.container, containerStyle, isFocused && { borderColor: colors.border_strong }]}>
            <SearchIcon />
            <TextInput
                onChangeText={onChangeText}
                placeholderTextColor={colors.text_light}
                style={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...textInputProps}
            />
            {value ? <TouchableOpacity style={styles.button} onPress={onClearText} >
                <CrossIcon width={12} height={12} color={colors.icon}/>
            </TouchableOpacity> : null}
            <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                <FilterIcon/>
                {hasActiveFilter && <View style={styles.filterBadge} />}
            </TouchableOpacity>
        </View>
    );
};
