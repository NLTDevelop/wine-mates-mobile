import { useMemo } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { IWineFilters } from '@/entities/wine/types/IWineFilters';
import { Button } from '@/UIKit/Button';
import { observer } from 'mobx-react-lite';
import { FiltersContent } from '../FiltersContent';
import { BottomModal } from '@/UIKit/BottomModal/ui';

interface IProps {
    isVisible: boolean;
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

export const MyWineFiltersBottomSheet = observer(({ isVisible, onClose, hasFilters, onClear, filters, selectedFilters, onSortChange, onColorsChange, onTypesChange, onApply }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <BottomModal visible={isVisible} onClose={onClose} customHeader={<View />}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} hitSlop={20} style={styles.headerAction}>
                        <CrossIcon />
                    </TouchableOpacity>
                    <Typography variant="h4" text={t('common.filters')} style={styles.title} pointerEvents="none" />
                    <TouchableOpacity onPress={onClear} hitSlop={20} disabled={!hasFilters} style={styles.headerAction}>
                        <Typography
                            variant="h6"
                            text={t('common.clear')}
                            style={hasFilters ? styles.clearButton : styles.clearButtonDisabled}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <FiltersContent
                        filters={filters}
                        selectedFilters={selectedFilters}
                        onSortChange={onSortChange}
                        onColorsChange={onColorsChange}
                        onTypesChange={onTypesChange}
                    />
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button type='main' onPress={onApply} text={t('common.showResults')} />
                </View>
            </View>
        </BottomModal>
    );
});
