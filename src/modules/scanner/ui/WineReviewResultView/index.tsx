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
import { useWineReviewResult } from '../../presenters/useWineReviewResult';
import { wineModel } from '@/entities/wine/WineModel';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';

export const WineReviewResultView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { handleSavePress, toggleNotes, isOpened, isError, getNotes, isLoading, isSaving } = useWineReviewResult();

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getNotes} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.review')} />}
                scrollEnabled
            >
                <View style={styles.container}>
                    <View>
                        <RateThisWine
                            sliderValue={wineModel.review?.rate || 0}
                            starRate={wineModel.review?.starRate || 0}
                            disabled={true}
                        />
                        <Notes isOpened={isOpened} toggleNotes={toggleNotes} />
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
        </WithErrorHandler>
    );
});
