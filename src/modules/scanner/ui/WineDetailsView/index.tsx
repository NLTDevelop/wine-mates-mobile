import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { ResultListHeader } from '../components/ResultListHeader';
import { ReviewListItem } from '../components/ReviewListItem';
import { useWineReviewsList } from '../../presenters/useWineReviewsList';
import { useRefresh } from '@/hooks/useRefresh';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';
import { useWineDetails } from '../../presenters/useWineDetails';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { Loader } from '@/UIKit/Loader';

export const WineDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { details, isError, getDetails, id, onVintageChange } = useWineDetails();
    const { data, isReviewsLoading, onRefresh, onEndReached } = useWineReviewsList(id, getDetails);
    const { refreshControl } = useRefresh(onRefresh);

    const keyExtractor = useCallback((item: IWineReviewsListItem) => `${item.id}`, []);
    const renderItem = useCallback(({ item }: { item: IWineReviewsListItem }) => <ReviewListItem item={item} />, []);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getDetails}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.result')} isCentered={false} />}
            >
                {!details ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        refreshControl={refreshControl}
                        onEndReached={onEndReached}
                        contentContainerStyle={styles.containerStyle}
                        ListHeaderComponent={<ResultListHeader data={details} onVintageChange={onVintageChange}/>}
                        ListFooterComponent={isReviewsLoading && data?.length ? <ListFooterLoader /> : null}
                    />
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
