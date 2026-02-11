import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { MyTasteProfileItem } from '../MyTasteProfileItem';
import { Loader } from '@/UIKit/Loader';
import { ITasteProfile } from '@/entities/wine/types/ITasteProfile';
import { useMyTasteProfile } from './useMyTasteProfile';

export const MyTasteProfile = observer(() => {
    const { styles, isLoading, tasteProfiles, refreshControl, keyExtractor, getTitle } = useMyTasteProfile();

    const renderItem = useCallback(
        ({ item }: { item: ITasteProfile }) => (
            <MyTasteProfileItem 
                title={getTitle(item)} 
                statistics={item.statistics}
                color={item.color}
            />
        ),
        [getTitle]
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
