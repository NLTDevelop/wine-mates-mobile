import { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { TickIcon } from '@assets/icons/TickIcon';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { useCustomDropdown } from '../presenters/useCustomDropdown';
import { SearchBar } from '@/UIKit/SearchBar';
import { IDropdownItem } from '../types/IDropdownItem';

interface IProps {
    placeholder: string;
    onPress: (item: IDropdownItem) => void;
    onSelect?: () => Promise<boolean>;
    data: IDropdownItem[];
    withSearch?: boolean;
    disabled?: boolean;
    selectedValue?: string | null;
    containerStyle?: ViewStyle; 
}

export const CustomDropdown = ({ placeholder, onPress, data, withSearch = false, onSelect, disabled = false,
    selectedValue = null, containerStyle }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { value, isOpen, search, filteredData, setSearch, handleSelect, setIsOpen, handleOpen }
        = useCustomDropdown({onPress, data, onSelect, selectedValue });

    return (
        <Dropdown
            style={[styles.dropdown, disabled ? styles.dropdownDisabled : null, containerStyle]}
            placeholderStyle={styles.placeholder}
            containerStyle={styles.dropdownContainer}
            search={withSearch}
            autoScroll={false}
            data={filteredData}
            labelField="label"
            valueField="value"
            value={value}
            placeholder={placeholder}
            activeColor="transparent"
            onFocus={handleOpen}
            onBlur={() => setIsOpen(false)}
            disable={disabled}
            onChange={handleSelect}
            renderInputSearch={() =>
                data.length > 10 ? (
                    <SearchBar
                        value={search}
                        onChangeText={setSearch}
                        placeholder={t('common.search')}
                        containerStyle={styles.searchContainer}
                    />
                ) : null
            }
            renderRightIcon={() => <ArrowDownIcon rotate={isOpen ? 180 : 0} />}
            renderItem={(item, selected) => (
                <View style={styles.itemContainer}>
                    <Typography text={item.label} variant="body_400" style={styles.itemText} />
                    {selected ? <TickIcon /> : null}
                </View>
            )}
        />
    );
};
