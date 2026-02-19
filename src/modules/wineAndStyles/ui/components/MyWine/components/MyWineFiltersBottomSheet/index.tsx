import { useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetScrollView,
    SCREEN_HEIGHT,
} from '@gorhom/bottom-sheet';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IWineFilters } from '@/entities/wine/types/IWineFilters';
import { Button } from '@/UIKit/Button';
import { observer } from 'mobx-react-lite';
import { FiltersContent } from './components/FiltersContent';

interface IProps {
    modalRef: React.RefObject<BottomSheetModal | null>;
    onClose: () => void;
    hasFilters: boolean;
    onClear: () => void;
    filters: IWineFilters | null;
    selectedFilters: { sort: (string | number)[]; colors: (string | number)[]; types: (string | number)[] };
    onSortChange: (selected: (string | number)[]) => void;
    onColorsChange: (selected: (string | number)[]) => void;
    onTypesChange: (selected: (string | number)[]) => void;
    onApply: () => void;
}

export const MyWineFiltersBottomSheet = observer(({ modalRef, onClose, hasFilters, onClear, filters, selectedFilters, onSortChange, onColorsChange, onTypesChange, onApply }: IProps) => {
    const { colors, t } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom, top), [colors, bottom, top]);

    const maxContentSize = useMemo(() => SCREEN_HEIGHT * 2 - top, [top]);

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ), []);

    return (
        <BottomSheetModal
            ref={modalRef}
            topInset={top}
            enablePanDownToClose
            enableDynamicSizing
            maxDynamicContentSize={maxContentSize}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetContainer}
            onDismiss={onClose}
        >
            <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} hitSlop={20}>
                        <CrossIcon />
                    </TouchableOpacity>
                    <Typography variant="h4" text={t('common.filters')} />
                    <TouchableOpacity onPress={onClear} hitSlop={20} disabled={!hasFilters}>
                        <Typography
                            variant="h6"
                            text={t('common.clear')}
                            style={hasFilters ? styles.clearButton : styles.clearButtonDisabled}
                        />
                    </TouchableOpacity>
                </View>
                <FiltersContent
                    filters={filters}
                    selectedFilters={selectedFilters}
                    onSortChange={onSortChange}
                    onColorsChange={onColorsChange}
                    onTypesChange={onTypesChange}
                />
                <View style={styles.buttonContainer}>
                    <Button type='main' onPress={onApply} text={t('common.showResults')} />
                </View>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});
