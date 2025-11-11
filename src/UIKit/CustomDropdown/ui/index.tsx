import { useMemo } from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { TickIcon } from '@/assets/icons/TickIcon';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';
import { IDropdownItem } from '../types/IDropdownItem';
import { useCustomDropdown } from '../presenters/useCustomDropdown';
import { SearchBar } from '@/UIKit/SearchBar';

interface IProps {
    placeholder: string;
    onPress: (item: any) => void;
    data: Array<{ label: string; value: string }>;
    withSearch?: boolean;
}

export const CustomDropdown = ({ placeholder, onPress, data, withSearch = false }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { value, isOpen, search, filteredData, setSearch, handleSelect, setIsOpen } = useCustomDropdown(onPress, data);

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            containerStyle={styles.dropdownContainer}
            data={filteredData}
            labelField="label"
            valueField="value"
            value={value}
            placeholder={placeholder}
            activeColor="transparent"
            search
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={handleSelect}
            renderInputSearch={() => (
                <>
                    {withSearch ? (
                        <SearchBar
                            value={search}
                            onChangeText={setSearch}
                            placeholder={t('common.search')}
                            containerStyle={styles.searchContainer}
                        />
                    ) : null}
                </>
            )}
            renderRightIcon={() => <ArrowDownIcon rotate={isOpen ? 180 : 0} />}
            renderItem={(item: IDropdownItem, selected?: boolean) => (
                <View style={styles.itemContainer}>
                    <Typography text={item.label} variant="body_400" style={styles.itemText} />
                    {selected ? <TickIcon /> : null}
                </View>
            )}
        />
    );
};
