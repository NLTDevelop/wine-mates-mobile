import { useMemo } from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { TickIcon } from '@/assets/icons/TickIcon';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';
import { useCustomDropdown } from '../presenters/useCustomDropdown';
import { SearchBar } from '@/UIKit/SearchBar';
import { Loader } from '@/UIKit/Loader';

interface IProps {
    placeholder: string;
    onPress: (item: string) => void;
    data: Array<{ label: string; value: string }>;
    withSearch?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    isLoadingError?: boolean;
    onRetry?: () => Promise<boolean>;
}

export const CustomDropdown = ({ placeholder, onPress, data, withSearch = false, isLoading = false,
    isLoadingError = false, onRetry,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { value, isOpen, search, filteredData, setSearch, handleSelect, setIsOpen, handleOpen }
        = useCustomDropdown({onPress, data, isLoadingError, onRetry});

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Loader />
            ) : (
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
                    onFocus={handleOpen}
                    onBlur={() => setIsOpen(false)}
                    onChange={handleSelect}
                    renderInputSearch={() =>
                        withSearch ? (
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
            )}
        </View>
    );
};
