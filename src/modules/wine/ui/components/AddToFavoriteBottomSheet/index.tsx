import { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { IFavoriteItem } from '@/modules/wine/types/IFavoriteItem';
import { Checkbox } from '@/UIKit/Checkbox';
import { Button } from '@/UIKit/Button';
import { BottomModal } from '@/UIKit/BottomModal/ui';

interface IProps {
    isVisible: boolean;
    onItemPress: (item: IFavoriteItem) => void;
    onClose: () => void;
    data: IFavoriteItem[];
    onSave: () => void;
    isLoading?: boolean;
    isSaving?: boolean;
}

export const AddToFavoriteBottomSheet = ({ isVisible, onItemPress, onClose, data, onSave, isLoading, isSaving }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const keyExtractor = useCallback((item: IFavoriteItem) => `${item.id}`, []);

    const createOnItemPress = useCallback((item: IFavoriteItem) => {
        return () => {
            onItemPress(item);
        };
    }, [onItemPress]);

    const renderItem = useCallback(({ item }: { item: IFavoriteItem }) => (
        <TouchableOpacity onPress={createOnItemPress(item)} style={styles.item}>
            <Typography variant="h6" text={item.title} />
            <Checkbox isChecked={item.isSelected} onPress={createOnItemPress(item)} />
        </TouchableOpacity>
    ), [createOnItemPress, styles]);

    const renderSeparator = useCallback(() => <View style={styles.itemSeparator} />, [styles]);

    return (
        <BottomModal visible={isVisible} onClose={onClose} title={t('common.save')}>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    ItemSeparatorComponent={renderSeparator}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                />
                <Button
                    type='main'
                    onPress={onSave}
                    text={t('common.choose')}
                    disabled={isSaving || isLoading}
                    inProgress={isSaving}
                />
            </View>
        </BottomModal>
    );
};
