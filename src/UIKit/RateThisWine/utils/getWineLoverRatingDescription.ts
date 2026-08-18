type Translate = (key: string) => string;

export const getWineLoverRatingDescription = (rating: number, t: Translate) => {
    if (rating >= 5) {
        return t('wine.ratingScale.exceptional');
    }

    if (rating >= 4.5) {
        return t('wine.ratingScale.veryHighQuality');
    }

    if (rating >= 4) {
        return t('wine.ratingScale.good');
    }

    if (rating >= 3.5) {
        return t('wine.ratingScale.average');
    }

    if (rating >= 3) {
        return t('wine.ratingScale.mediocre');
    }

    if (rating >= 2.5) {
        return t('wine.ratingScale.poor');
    }

    return t('wine.ratingScale.defective');
};
