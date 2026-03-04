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

const mockFAQData: IFAQListItem[] = [
    {
        id: 1,
        topicName: 'Account & Settings',
        questions: [
            {
                question: 'How do I change my password?',
                answer: 'Open Settings -> Account -> Change Password, then follow the prompts.',
            },
            {
                question: 'How do I delete my account?',
                answer: 'Go to Settings -> Account -> Delete Account and confirm the action.',
            },
        ],
    },
    {
        id: 2,
        topicName: 'Events & Booking',
        questions: [
            {
                question: 'How can I book an event?',
                answer: 'Open the Event Map, select an event, and tap the booking button.',
            },
            {
                question: 'Can I cancel my reservation?',
                answer: 'Yes, you can cancel your reservation. Simply go to the event details page and select "Cancel reservation." If you booked by phone, please call the provided number to cancel directly.',
            },
        ],
    },
    {
        id: 3,
        topicName: 'Tastings & Ratings',
        questions: [
            {
                question: 'How do I add a tasting note?',
                answer: 'Open a wine card, tap Add Note, and save your tasting details.',
            },
            {
                question: 'How do I rate a wine?',
                answer: 'Use the rating slider on the wine page and tap Save.',
            },
            {
                question: 'What’s the difference between “Body” and “Finish”?',
                answer: 'Body describes how heavy the wine feels in your mouth, while finish is the taste and sensation that remain after swallowing.',
            },
        ],
    },
];

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
                    data={mockFAQData || data}
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
