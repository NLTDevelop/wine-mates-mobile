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
import { useRefresh } from '@/hooks/useRefresh';

export const WineReviewResultView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { handleSavePress, note, isLoading, isSaving, getNote } = useWineReviewResult();
    const { refreshControl } = useRefresh(getNote);

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('wine.review')} />}
            scrollEnabled
            refreshControl={refreshControl}
        >
            <View style={styles.container}>
                <View>
                    <RateThisWine
                        sliderValue={wineModel.review?.rate || 0}
                        starRate={wineModel.review?.starRate || 0}
                        disabled={true}
                    />
                    <Notes />
                    <FoodPairing />
                    <TastingNote note={note} isLoading={isLoading} />
                    <SelectedParameters containerStyle={styles.selectedParameters} />
                </View>
                <Button
                    text={t('common.save')}
                    onPress={handleSavePress}
                    containerStyle={styles.button}
                    inProgress={isSaving}
                />
            </View>
        </ScreenContainer>
    );
});
