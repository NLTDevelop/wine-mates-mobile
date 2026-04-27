import { RefObject, useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetFlatList, WINDOW_HEIGHT} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useCountryPickerModal } from '@/libs/countryCodePicker/presenters/useCountryPickerModal';
import { CrossIcon } from '@assets/icons/CrossIcon';
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
    const snapPoints = useMemo(() => [WINDOW_HEIGHT], []);
    const renderBackdrop = useCallback((props: any) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} onPress={handleClose} />
    ), [handleClose]);
    const renderHandle = useCallback(() => null, []);

    const keyExtractor = useCallback((item: ICountry) => item.cca2, []);
    const renderItem = useCallback(({ item }: { item: ICountry }) => (
        <CountryListItem item={item} handleCountryPress={handleCountryPress} showCountryCode={showCountryCode} />
    ), [handleCountryPress, showCountryCode]);

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            handleComponent={renderHandle}
            enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.container}
            topInset={top}
            enablePanDownToClose
            onDismiss={handleClose}
        >
            <View style={styles.header}>
                <Typography variant="h4" text={t('registration.countryCode')} style={styles.title} />
                <TouchableOpacity onPress={handleClose} style={styles.closeContainer} hitSlop={20}>
                    <CrossIcon />
                </TouchableOpacity>
            </View>
            <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder={t('common.search')}
                containerStyle={styles.searchContainer}
            />
            <BottomSheetFlatList
                data={countriesData}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
                keyboardShouldPersistTaps="handled"
                initialNumToRender={30}
                windowSize={30}
                maxToRenderPerBatch={60}
                removeClippedSubviews
            />
        </BottomSheetModal>
    );
};
