import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { TitledContent } from '@/UIKit/TitledContent';
import { Typography } from '@/UIKit/Typography';
import { WineListItem } from '@/UIKit/WineListItem';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { MarqueeText } from '@/UIKit/MarqueeText';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';

const MOCK_WINE: IWineListItem = {
    "id": 4,
    "name": "1827 Cabernet Sauvignon de Purcari",
    "vintage": 2022,
    "averageUserRating": 0,
    "countUserRating": 0,
    "averageExpertRating": 88.5,
    "countExpertRating": 4,
    "createdAt": "2026-03-02T16:12:46.958Z",
    "image": {
        "name": "ca23af35-dddd-42cb-b478-f8005f18fc88.jpg",
        "originalName": "test.jpg",
        "mimetype": "image/jpeg",
        "size": 23968,
        "smallUrl": "https://fsn1.your-objectstorage.com/nltdev/test/image/small/ca23af35-dddd-42cb-b478-f8005f18fc88.jpg",
        "mediumUrl": "https://fsn1.your-objectstorage.com/nltdev/test/image/medium/ca23af35-dddd-42cb-b478-f8005f18fc88.jpg",
        "originalUrl": "https://fsn1.your-objectstorage.com/nltdev/test/image/original/ca23af35-dddd-42cb-b478-f8005f18fc88.jpg"
    },
    "lastRate": {
        "id": 16,
        "review": "Nice wine. The Best wine of this day.",
        "createdAt": "2026-03-03T09:26:04.707Z",
        "user": {
            "id": 65,
            "firstName": "wine",
            "lastName": "expert premium",
            "image": null
        }
    }
};

export const WineOfTheDay = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const rightComponent = (
        <TitledContent.RoundedButton />
    );

    const customBottomComponent = (
        <View style={styles.bottomContainer}>
            <MarqueeText isEverlasting speed={30}>
                <Typography
                    text={t('home.mostTastedWine')}
                    variant="subtitle_12_400"
                    style={styles.bottomText}
                />
            </MarqueeText>
        </View>
    );

    const lastReviewData = MOCK_WINE.lastRate || MOCK_WINE.lastReview;
    const footer = lastReviewData ? (
        <WineReviewBlock user={lastReviewData.user} review={lastReviewData.review} />
    ) : null;

    return (
        <TitledContent titleVariant="h3" title={'Wine of the day'} rightComponent={rightComponent}>
            <WineListItem
                item={MOCK_WINE}
                hideSimilarity
                customBottomComponent={customBottomComponent}
                footer={footer}
            />
        </TitledContent>
    );
};
