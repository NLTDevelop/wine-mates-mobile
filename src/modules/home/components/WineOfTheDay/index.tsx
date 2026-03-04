import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { TitledContent } from '@/UIKit/TitledContent';
import { WineListItem } from '@/UIKit/WineListItem';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineOfTheDayFooter, WineOfTheDayMarquee, WineOfTheDayButton } from '@/modules/home/components/WineOfTheDay/components';
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

interface IProps {
    onArrowPress?: () => void;
    onWinePress?: () => void;
}

export const WineOfTheDay = ({ onArrowPress, onWinePress }: IProps) => {

    const wine = MOCK_WINE;
    //TODO: remove if will not use
    // const { colors } = useUiContext();
    // const styles = useMemo(() => getStyles(colors), [colors]);

    const lastReviewData = wine.lastRate || wine.lastReview;

    return (
        <TitledContent titleVariant="h3" title={'Wine of the day'} rightComponent={<TitledContent.RoundedButton onPress={onArrowPress} />}>
            <WineListItem
                item={MOCK_WINE}
                hideSimilarity
                customBottomComponent={<WineOfTheDayMarquee />}
                footer={lastReviewData ? <WineReviewBlock user={lastReviewData.user} review={lastReviewData.review} /> : null}
                onPress={onWinePress}
            />
        </TitledContent>
    );
};
