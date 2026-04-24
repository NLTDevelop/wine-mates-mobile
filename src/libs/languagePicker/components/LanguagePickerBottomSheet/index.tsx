import { RefObject, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { SearchBar } from '@/UIKit/SearchBar';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { useLanguagePickerModal } from './presenters/useLanguagePickerModal';
import { ILanguageOption } from '../../types/ILanguageOption';
import { LanguageListItem } from '../LanguageListItem';

interface IProps {
    modalRef: RefObject<BottomSheetModal | null>;
    onSelect: (item: ILanguageOption) => void;
    onClose: () => void;
}

export const LanguagePickerBottomSheet = ({ modalRef, onSelect, onClose }: IProps) => {
    const { colors, t } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);
    const { languagesData, search, onChangeSearch, snapPoints } = useLanguagePickerModal();

    const renderBackdrop = (props: BottomSheetBackdropProps) => {
        return <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} onPress={onClose} />;
    };
    const renderHandle = () => null;

    const onLanguagePress = (item: ILanguageOption) => {
        onSelect(item);
    };

    const renderItem = ({ item }: { item: ILanguageOption }) => {
        return <LanguageListItem item={item} onPress={onLanguagePress} />;
    };

    const keyExtractor = (item: ILanguageOption) => {
        return item.code;
    };

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
            onDismiss={onClose}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeContainer} hitSlop={20}>
                    <CrossIcon />
                </TouchableOpacity>
                <Typography variant="h4" text={t('event.eventLanguage')} style={styles.title} />
            </View>

            <SearchBar
                value={search}
                onChangeText={onChangeSearch}
                placeholder={t('common.search')}
                containerStyle={styles.searchContainer}
            />

            <BottomSheetFlatList
                data={languagesData}
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
