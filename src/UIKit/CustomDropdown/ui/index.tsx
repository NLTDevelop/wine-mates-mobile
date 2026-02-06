import { useMemo, useRef, forwardRef, useImperativeHandle, type ReactElement } from 'react';
import { TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
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
    selectedValue?: string | number | null;
    containerStyle?: ViewStyle;
    renderItem?: (item: IDropdownItem, selected?: boolean) => ReactElement | null;
    renderSelectedValue?: (item: IDropdownItem) => ReactElement | null;
    renderFooter?: () => ReactElement | null;
}

export const CustomDropdown = forwardRef<any, IProps>(({ placeholder, onPress, data, withSearch = false, onSelect, disabled = false,
    selectedValue = null, containerStyle, renderItem, renderSelectedValue, renderFooter }, ref) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const dropdownRef = useRef<any>(null);

    const { value, isOpen, search, filteredData, setSearch, handleSelect, setIsOpen, handleOpen }
        = useCustomDropdown({onPress, data, onSelect, selectedValue });
    const selectedItem = useMemo(
        () => data.find(item => item.value === value) || null,
        [data, value],
    );

    useImperativeHandle(ref, () => ({
        close: () => {
            dropdownRef.current?.close?.();
        },
        open: () => {
            dropdownRef.current?.open?.();
        },
    }));

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (!disabled && dropdownRef.current) {
                    dropdownRef.current.open();
                }
            }}
        >
            <View>
                <View>
                    <Dropdown
                        ref={dropdownRef}
                        style={[styles.dropdown, disabled ? styles.dropdownDisabled : null, containerStyle]}
                        placeholderStyle={styles.placeholder}
                        containerStyle={styles.dropdownContainer}
                        selectedTextStyle={[
                            styles.selectedText,
                            renderSelectedValue && selectedItem ? styles.selectedTextHidden : null,
                        ]}
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
                        flatListProps={
                            renderFooter
                                ? {
                                    ListFooterComponent: renderFooter,
                                    contentContainerStyle: {
                                        paddingBottom: 0,
                                    },
                                }
                                : undefined
                        }
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
                        renderItem={
                            renderItem
                                ? (item, selected) => renderItem(item as IDropdownItem, selected)
                                : (item, selected) => (
                                    <View style={styles.itemContainer}>
                                        <Typography text={item.label} variant="body_400" style={styles.itemText} />
                                        {selected ? <TickIcon /> : null}
                                    </View>
                                )
                        }
                    />
                    {renderSelectedValue && selectedItem ? (
                        <View style={styles.selectedOverlay} pointerEvents="none">
                            {renderSelectedValue(selectedItem)}
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});
