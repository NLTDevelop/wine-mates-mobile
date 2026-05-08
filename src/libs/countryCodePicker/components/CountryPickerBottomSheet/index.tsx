import { RefObject, useCallback, useMemo } from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useCountryPickerModal } from '@/libs/countryCodePicker/presenters/useCountryPickerModal';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { CountryListItem } from '../CountryListItem';
import { SearchBar } from '@/UIKit/SearchBar';
import { ICountry } from '../../types/ICountry';

const windowHeight = Dimensions.get('window').height;

interface IProps {
    modalRef: RefObject<BottomSheetModal | null>;
    onCountryPress: (item: ICountry) => void;
    onClose: () => void;
    onDismiss: () => void;
    showCountryCode?: boolean;
}

export const CountryPickerBottomSheet = ({ modalRef, onCountryPress, onClose, onDismiss, showCountryCode = false }: IProps) => {
    const { colors, t } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);
    const { countriesData, search, setSearch } = useCountryPickerModal();
    const snapPoints = useMemo(() => [windowHeight], []);
    const renderBackdrop = useCallback((props: any) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} onPress={onClose} />
    ), [onClose]);
    const renderHandle = useCallback(() => null, []);

    const keyExtractor = useCallback((item: ICountry) => item.cca2, []);
    const renderItem = useCallback(({ item }: { item: ICountry }) => (
        <CountryListItem item={item} handleCountryPress={onCountryPress} showCountryCode={showCountryCode} />
    ), [onCountryPress, showCountryCode]);

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
            onDismiss={onDismiss}
        >
            <View style={styles.header}>
                <Typography variant="h4" text={t('registration.countryCode')} style={styles.title} />
                <TouchableOpacity onPress={onClose} style={styles.closeContainer} hitSlop={20}>
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
