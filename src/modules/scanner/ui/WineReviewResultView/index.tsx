import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { observer } from 'mobx-react-lite';
import { SelectedParameters } from '../components/SelectedParameters';
import { RateThisWine } from '../components/RateThisWine';
import { Notes } from '../components/Notes';
import { wineModel } from '@/entities/wine/WineModel';
import { useWineReviewResult } from '../../presenters/useWineReviewResult';
import { FoodPairing } from '../components/FoodPairing';
import { TastingNote } from '../components/TastingNote';
import { Loader } from '@/UIKit/Loader';
import { Typography } from '@/UIKit/Typography';

export const WineReviewResultView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { handleSavePress, note, isLoading, isSaving, limits, isLoadingLimits, getNote, setLimits } =
        useWineReviewResult();

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('wine.review')} />}
            scrollEnabled
        >
            {isLoadingLimits ? (
                <Loader />
            ) : (
                <View style={styles.container}>
                    <View>
                        <RateThisWine
                            sliderValue={wineModel.review?.rate || 0}
                            starRate={wineModel.review?.starRate || 0}
                            disabled={true}
                        />
                        <Notes />
                        <View style={styles.limitContainer}>
                            {limits?.aiUsage.left === 0 ? (
                                <>
                                    <Typography text={t('aiAttempts.label3')} />
                                    <Typography text={t('aiAttempts.label4')} />
                                    <Button
                                        text={t('aiAttempts.subscribe')}
                                        onPress={() => {}}
                                        containerStyle={styles.subscribeButton}
                                    />
                                </>
                            ) : (
                                <Typography variant="h6">
                                    {t('aiAttempts.label1')}{' '}
                                    <Typography
                                        text={`${limits?.aiUsage.left ?? '-'}/${limits?.aiUsage.total ?? '-'}`}
                                        variant="h5"
                                        style={styles.countText}
                                    />{' '}
                                    {t('aiAttempts.label2')}
                                </Typography>
                            )}
                        </View>
                        <FoodPairing limits={limits} setLimits={setLimits} />
                        <TastingNote note={note} isLoading={isLoading} limits={limits} onGeneratePress={getNote} />
                        <SelectedParameters containerStyle={styles.selectedParameters} />
                    </View>
                    <Button
                        text={t('common.save')}
                        onPress={handleSavePress}
                        containerStyle={styles.button}
                        inProgress={isSaving}
                    />
                </View>
            )}
        </ScreenContainer>
    );
});
