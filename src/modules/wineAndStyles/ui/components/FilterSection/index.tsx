import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useFilterSection } from '../../../presenters/useFilterSection';
import { IWineFilterOption } from '@/entities/wine/types/IWineFilters';
import { observer } from 'mobx-react-lite';

interface IProps {
    title: string;
    options: IWineFilterOption[];
    multipleSelect: boolean;
    onChange: (selected: (string | number)[]) => void;
    selectedValues: (string | number)[];
}

export const FilterSection = observer(({ title, options, multipleSelect, onChange, selectedValues }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isSelected, handleItemPress } = useFilterSection({ multipleSelect, onChange, selectedValues });

    return (
        <View style={styles.container}>
            <Typography variant="h5" text={title} style={styles.title} />
            <View style={styles.itemsContainer}>
                {options.map((option) => {
                    const selected = isSelected(option.value);
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={handleItemPress(option.value)}
                            style={[styles.item, selected && styles.itemSelected]}
                        >
                            <Typography
                                variant="body_400"
                                text={option.label}
                                style={{ color: selected ? colors.text_inverted : colors.text }}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});
