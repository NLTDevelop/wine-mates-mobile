import { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { MyTasteProfileItem } from '../MyTasteProfileItem';
import { Loader } from '@/UIKit/Loader';
import { ITasteProfile } from '@/entities/wine/types/ITasteProfile';
import { useUiContext } from '@/UIProvider';
import { useTasteProfile } from '@/modules/wineAndStyles/presenters/useTasteProfile';
import { useRefresh } from '@/hooks/useRefresh';
import { getStyles } from './styles';

export const MyTasteProfile = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isLoading, getData, tasteProfiles } = useTasteProfile();
    const { refreshControl } = useRefresh(getData);

    const keyExtractor = useCallback((item: ITasteProfile) => `${item.type.id}-${item.color.id}`, []);

    const renderItem = useCallback(
        ({ item }: { item: ITasteProfile }) => (
            <MyTasteProfileItem 
                title={`${item.type.name} ${item.color.name}`}
                statistics={item.statistics}
                color={item.color}
            />
        ),
        []
    );

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <FlatList
                    data={tasteProfiles}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    refreshControl={refreshControl}
                    contentContainerStyle={styles.containerStyle}
                />
            )}
        </>
    );
});
