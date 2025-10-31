import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { FlatList, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { useRefresh } from '@/hooks/useRefresh';
import { useScannerResultsList } from '../../presenters/useScannerResultsList';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { ScannerListItem } from '../components/ScannerListItem';

export const ScanResultsListView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, isLoading, onRefresh, onEndReached, handleItemPress, handleAddWinePress } = useScannerResultsList();
    const { refreshControl, refreshing } = useRefresh(onRefresh);

    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(({ item }: { item: IWineListItem }) => {
        return <ScannerListItem item={item} onPress={handleItemPress} />;
    }, [handleItemPress]);

    return (
        // <WithErrorHandler error={null} onRetry={() => {}}>
        <ScreenContainer
            edges={['top']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('scanner.results')} />}
        >
            <View style={styles.container}>
                <Typography text={t('scanner.resultsTitle')} variant="body_400" style={styles.title} />
                <FlatList
                    onEndReached={onEndReached}
                    refreshControl={refreshControl}
                    refreshing={refreshing}
                    data={data || []}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    style={styles.list}
                    contentContainerStyle={styles.contentContainerStyle}
                    ListFooterComponent={isLoading && data?.length ? <ListFooterLoader /> : null}
                    ListEmptyComponent={
                        <EmptyListView
                            isLoading={isLoading}
                            // image={
                            //     <Image
                            //         source={require('../../../../../../assets/images/caa/EmptyListInspections.png')}
                            //         style={styles.image}
                            //     />
                            // }
                            text={'Nothing found'}
                        />
                    }
                />
                <Button text={t('scanner.addWine')} onPress={handleAddWinePress} containerStyle={styles.button}/>
            </View>
        </ScreenContainer>
        // </WithErrorHandler>
    );
};
