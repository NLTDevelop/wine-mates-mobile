import { useUiContext } from '@/UIProvider';
import { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { getStyles } from './styles';
import { observer } from 'mobx-react-lite';
import { MyTasteProfileItem } from '../MyTasteProfileItem';
import { useTasteProfile } from '@/modules/wineAndStyles/presenters/useTasteProfile';
import { useRefresh } from '@/hooks/useRefresh';
import { Loader } from '@/UIKit/Loader';
import { IMyTasteProfileListItem } from '@/entities/wine/types/IMyTasteProfileListItem';

const MOCK_DATA: IMyTasteProfileListItem[] = [
    { id: 1, title: 'Sparkling white wine' },
    { id: 2, title: 'Sparkling rose wine' },
    { id: 3, title: 'Sparkling red wine' },
    { id: 4, title: 'White wine' },
    { id: 5, title: 'Red wine' },
    { id: 6, title: 'Rose wine' },
];

export const MyTasteProfile = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isLoading, getData } = useTasteProfile();
    const { refreshControl } = useRefresh(getData);

    const keyExtractor = useCallback((item: IMyTasteProfileListItem) => `${item.id}`, []);
    const renderItem = useCallback(
        ({ item }: { item: IMyTasteProfileListItem }) => <MyTasteProfileItem title={item.title} />,
    []);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <FlatList
                    data={MOCK_DATA}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    refreshControl={refreshControl}
                    // onEndReached={onEndReached}
                    contentContainerStyle={styles.containerStyle}
                    // ListFooterComponent={isLoading && wines?.length ? <ListFooterLoader /> : null}
                />
            )}
        </>
    );
});
