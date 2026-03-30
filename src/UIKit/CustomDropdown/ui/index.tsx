import { useMemo, useRef, forwardRef, useImperativeHandle, type ReactElement, useCallback } from 'react';
import { Animated, TouchableWithoutFeedback, View, type ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { TickIcon } from '@assets/icons/TickIcon';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { useCustomDropdown } from '../presenters/useCustomDropdown';
import { SearchBar } from '@/UIKit/SearchBar';
import { IDropdownItem } from '../types/IDropdownItem';
import { useCustomDropdownAnimation } from '../presenters/useCustomDropdownAnimation';

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
    emptyStateLabel?: string;
}

export interface ICustomDropdownRef {
    close: () => void;
    open: () => void;
}

export const CustomDropdown = forwardRef<ICustomDropdownRef, IProps>(
    (
        {
            placeholder,
            onPress,
            data,
            withSearch = false,
            onSelect,
            disabled = false,
            selectedValue = null,
            containerStyle,
            renderItem,
            renderSelectedValue,
            renderFooter,
            emptyStateLabel,
        },
        ref,
    ) => {
        const { colors, t } = useUiContext();
        const styles = useMemo(() => getStyles(colors), [colors]);
        const dropdownRef = useRef<any>(null);

        const { value, isOpen, search, filteredData, selectedItem, triggerContainerRef, dropdownLiftOffset, shouldShowSearch,
            setSearch, handleSelect, onBlurDropdown, onPressDropdown, onCloseDropdown, onOpenDropdown, handleOpen,
        } = useCustomDropdown({ onPress, data, onSelect, selectedValue, emptyStateLabel, withSearch });
        const { animatedArrowStyle, animatedLiftOffset } = useCustomDropdownAnimation({ isOpen, dropdownLiftOffset });

        useImperativeHandle(ref, () => ({
            close: () => {
                onCloseDropdown(dropdownRef.current);
            },
            open: () => {
                onOpenDropdown(disabled, dropdownRef.current);
            },
        }));

        const onDropdownPress = useCallback(() => {
            onPressDropdown(disabled, dropdownRef.current);
        }, [disabled, onPressDropdown]);

        const renderInputSearch = useCallback(() => {
            if (!shouldShowSearch) {
                return null;
            }

            return (
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t('common.search')}
                    containerStyle={styles.searchContainer}
                />
            );
        }, [search, setSearch, shouldShowSearch, styles.searchContainer, t]);

        const renderRightIcon = useCallback(() => (
            <Animated.View style={animatedArrowStyle}>
                <ArrowDownIcon rotate={0} />
            </Animated.View>
        ), [animatedArrowStyle]);

        const renderDropdownItem = useCallback(
            (item: unknown, selected?: boolean) => {
                const dropdownItem = item as IDropdownItem;

                if (renderItem) {
                    return renderItem(dropdownItem, selected);
                }

                return (
                    <View style={styles.itemContainer}>
                        <Typography text={dropdownItem.label} variant="body_400" style={styles.itemText} />
                        {selected ? <TickIcon /> : null}
                    </View>
                );
            },
            [renderItem, styles.itemContainer, styles.itemText],
        );

        return (
            <TouchableWithoutFeedback onPress={onDropdownPress}>
                <View ref={triggerContainerRef}>
                    <View>
                        <Dropdown
                            ref={dropdownRef}
                            style={[styles.dropdown, disabled ? styles.dropdownDisabled : null, containerStyle]}
                            placeholderStyle={styles.placeholder}
                            containerStyle={[
                                styles.dropdownContainer,
                                animatedLiftOffset > 0 ? { marginTop: -animatedLiftOffset } : null,
                            ]}
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
                            onBlur={onBlurDropdown}
                            disable={disabled}
                            onChange={handleSelect}
                            flatListProps={{
                                keyboardShouldPersistTaps: 'handled',
                                keyboardDismissMode: 'none',
                                ...(renderFooter
                                    ? {
                                          ListFooterComponent: renderFooter,
                                          contentContainerStyle: {
                                              paddingBottom: 0,
                                          },
                                      }
                                    : {}),
                            }}
                            renderInputSearch={renderInputSearch}
                            renderRightIcon={renderRightIcon}
                            renderItem={renderDropdownItem}
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
    },
);

CustomDropdown.displayName = 'CustomDropdown';
