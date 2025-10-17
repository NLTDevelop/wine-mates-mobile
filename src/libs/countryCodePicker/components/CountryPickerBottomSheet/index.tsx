import { RefObject, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView, WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useCountryPickerModal } from '@/libs/countryCodePicker/presenters/useCountryPickerModal';
import { CrossIcon } from '@/assets/icons/CrossIcon';
import { CountryListItem } from '../CountryListItem';
import { SearchBar } from '@/UIKit/SearchBar';
import { ICountry } from '../../types/ICountry';

interface IProps {
    modalRef: RefObject<BottomSheetModal | null>;
    handleCountryPress: (item: ICountry) => void;
    handleClose: () => void;
    showCountryCode?: boolean;
}

export const CountryPickerBottomSheet = ({ modalRef, handleCountryPress, handleClose, showCountryCode = false }: IProps) => {
    const { colors, t } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);
    const { countriesData, search, setSearch } = useCountryPickerModal();

    const maxSnapPoint = WINDOW_HEIGHT - top;
    const snapPoints = useMemo(() => [maxSnapPoint], [maxSnapPoint]);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} onPress={handleClose} />
        ),
        [handleClose],
    );

    const keyExtractor = useCallback((item: ICountry) => item.cca2, []);
    const renderItem = useCallback(
        ({ item }: { item: ICountry }) => (
            <CountryListItem item={item} handleCountryPress={handleCountryPress} showCountryCode={showCountryCode} />
        ),
        [handleCountryPress, showCountryCode],
    );

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            handleComponent={() => null}
            backdropComponent={renderBackdrop}
            enableDynamicSizing={false}
            backgroundStyle={styles.container}
            enablePanDownToClose={false}
        >
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClose} style={styles.closeContainer}>
                        <CrossIcon />
                    </TouchableOpacity>
                    <Typography variant="h4" text={t('registration.countryCode')} style={styles.title} />
                </View>
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t('common.search')}
                    containerStyle={styles.searchContainer}
                />
            </View>

            <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >
                <FlatList
                    data={countriesData}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    removeClippedSubviews={true}
                    initialNumToRender={25}
                    contentContainerStyle={styles.listContentContainer}
                    windowSize={7}
                />
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
};
