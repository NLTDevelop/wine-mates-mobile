import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, View } from 'react-native';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
    WINDOW_HEIGHT,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { BottomSheetInput } from '@/UIKit/BottomSheetInput';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { SearchIcon } from '@assets/icons/SearchIcon';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { getStyles } from './styles';
import { CityOptionItem } from '../CityOptionItem';
import { SearchClearButton } from '../SearchClearButton';
import { useSelectCityBottomSheet } from './presenters/useSelectCityBottomSheet';

interface IProps {
    modalRef: React.RefObject<BottomSheetModal | null>;
    value: string;
    data: IDropdownItem[];
    isLoading: boolean;
    emptyText: string;
    onChangeText: (value: string) => void;
    onSelect: (item: IDropdownItem) => void;
    onClose: () => void;
}

export const SelectCityBottomSheet = ({
    modalRef,
    value,
    data,
    isLoading,
    emptyText,
    onChangeText,
    onSelect,
    onClose,
}: IProps) => {
    const { colors, t } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom, top), [colors, bottom, top]);
    const { onClearSearch } = useSelectCityBottomSheet({ onChangeText });

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
        ),
        [],
    );

    const renderHandle = useCallback(() => null, []);

    const keyExtractor = useCallback((item: IDropdownItem) => String(item.value), []);

    const renderItem = useCallback(({ item }: { item: IDropdownItem }) => {
        return <CityOptionItem item={item} onSelect={onSelect} />;
    }, [onSelect]);

    return (
        <BottomSheetModal
            ref={modalRef}
            topInset={top}
            enablePanDownToClose
            enableDynamicSizing
            maxDynamicContentSize={WINDOW_HEIGHT}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            handleComponent={renderHandle}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetContainer}
            onDismiss={onClose}
        >
            <BottomSheetView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerSpacer} />
                    <Typography variant="h4" text={t('settings.city')} />
                    <Pressable style={styles.closeButton} onPress={onClose} hitSlop={20}>
                        <CrossIcon />
                    </Pressable>
                </View>

                <BottomSheetInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={t('common.search')}
                    containerStyle={styles.searchContainer}
                    LeftAccessory={
                        <View style={styles.searchIconContainer}>
                            <SearchIcon />
                        </View>
                    }
                    RightAccessory={<SearchClearButton visible={!!value} onPress={onClearSearch} />}
                />

                <FlatList
                    data={data}
                    style={styles.list}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            {isLoading ? (
                                <ActivityIndicator size="small" color={colors.text} style={styles.loader} />
                            ) : (
                                <>
                                    <Image
                                        source={require('@assets/images/city_search.jpeg')}
                                        style={styles.emptyImage}
                                    />
                                    <Typography text={emptyText} variant="h5" style={styles.emptyText} />
                                </>
                            )}
                        </View>
                    }
                />
            </BottomSheetView>
        </BottomSheetModal>
    );
};
