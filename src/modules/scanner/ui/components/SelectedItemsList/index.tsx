import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { NextLongArrowIcon } from '@/assets/icons/NextLongArrowIcon';
import { FlatList } from 'react-native-gesture-handler';
import { SelectedItems } from '../SelectedItem';
import { ISelectedSmell } from '@/modules/scanner/presenters/useWineSmell';

interface IProps {
    data: ISelectedSmell[];
    onPress: (item: ISelectedSmell) => void;
}

export const SelectedItemsList = ({ data, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const keyExtractor = useCallback((item: ISelectedSmell, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: ISelectedSmell }) => <SelectedItems item={item} onPress={() => onPress(item)} />,
        [onPress],
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => {}}>
                <ArrowIcon width={16} height={16} />
            </TouchableOpacity>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                style={styles.list}
                contentContainerStyle={styles.contentContainer}
            />
            <TouchableOpacity style={styles.button} onPress={() => {}}>
                <NextLongArrowIcon width={16} height={16} color={colors.icon}/>
            </TouchableOpacity>
        </View>
    );
};
