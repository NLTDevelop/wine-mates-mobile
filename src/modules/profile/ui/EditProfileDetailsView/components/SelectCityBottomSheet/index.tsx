import { useCallback, useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { getStyles } from './styles';
import { CityOptionItem } from '../CityOptionItem';
import { useSelectCityBottomSheet } from './presenters/useSelectCityBottomSheet';
import { SearchBar } from '@/UIKit/SearchBar';

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
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);
    const { animatedListOffsetStyle, snapPoints, onSheetAnimate } = useSelectCityBottomSheet({
        modalRef,
        bottomInset: bottom,
    });

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ), []);

    const keyExtractor = useCallback((item: IDropdownItem) => String(item.value), []);

    const renderItem = useCallback(
        ({ item }: { item: IDropdownItem }) => {
            return <CityOptionItem item={item} onSelect={onSelect} />;
        },
        [onSelect],
    );

    return (
        <BottomSheetModal
            ref={modalRef}
            backgroundStyle={styles.bottomSheetContainer}
            handleComponent={null}
            enableDynamicSizing={false}
            snapPoints={snapPoints}
            topInset={top}
            enablePanDownToClose={false}
            onDismiss={onClose}
            onAnimate={onSheetAnimate}
            backdropComponent={renderBackdrop}
            keyboardBehavior={'interactive'}
            keyboardBlurBehavior="restore"
            enableHandlePanningGesture={false}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerSpacer} />
                    <Typography variant="h4" text={t('settings.city')} />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={20}>
                        <CrossIcon />
                    </TouchableOpacity>
                </View>

                <SearchBar
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={t('common.search')}
                    containerStyle={styles.searchContainer}
                />

                <Animated.View style={[styles.listContainer, animatedListOffsetStyle]}>
                        <BottomSheetFlatList
                            data={data}
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={ <EmptyListView
                                image={<Image source={require('@assets/images/city_search.jpeg')} style={styles.emptyImage} />}
                                text={emptyText}
                                isLoading={isLoading}
                            />}
                            
                        />
                </Animated.View>
                <View style={styles.footer}/>
            </View>
        </BottomSheetModal>
    );
};
