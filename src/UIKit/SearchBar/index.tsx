import { View, TextInput, TextInputProps, ViewStyle, TouchableOpacity } from 'react-native';
import { forwardRef } from 'react';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useSearchBar } from './presenters/useSearchBar';
import { SearchIcon } from '@assets/icons/SearchIcon';

interface IProps extends TextInputProps {
    containerStyle?: ViewStyle;
}

export const SearchBar = forwardRef<TextInput, IProps>((props, ref) => {
    const { onChangeText, containerStyle, value } = props;
    const { colors } = useUiContext();
    const styles = getStyles(colors);
    const { isFocused, handleFocus, handleBlur, onClearText } = useSearchBar(onChangeText);

    return (
        <View style={[styles.container, containerStyle, isFocused && { borderColor: colors.border_strong }]}>
            <SearchIcon />
            <TextInput
                ref={ref}
                onChangeText={onChangeText}
                placeholderTextColor={colors.text_light}
                style={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
            />
            {!!value ? <TouchableOpacity style={styles.button} onPress={onClearText} >
                <CrossIcon width={12} height={12} color={colors.icon}/>
            </TouchableOpacity> : null}
        </View>
    );
});
