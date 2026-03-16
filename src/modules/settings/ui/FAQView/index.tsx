import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { FlatList } from 'react-native';
import { IFAQListItem } from '@/entities/FAQ/types/IFAQListItem';
import { useRefresh } from '@/hooks/useRefresh';
import { Loader } from '@/UIKit/Loader';
import { useFAQ } from '../../presenters/useFAQ';
import { FAQListItem } from '../components/FAQListItem';

export const FAQView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, isLoading, getFAQ } = useFAQ();
    const { refreshControl } = useRefresh(getFAQ);

    const keyExtractor = useCallback((item: IFAQListItem, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(({ item }: { item: IFAQListItem }) => <FAQListItem item={item} />, []);

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            scrollEnabled={false}
            headerComponent={<HeaderWithBackButton title={t('faq.faq')} isCentered={false} />}
        >
            {isLoading ? (
                <Loader />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    refreshControl={refreshControl}
                    style={styles.list}
                    contentContainerStyle={styles.contentContainerStyle}
                />
            )}
        </ScreenContainer>
    );
};
