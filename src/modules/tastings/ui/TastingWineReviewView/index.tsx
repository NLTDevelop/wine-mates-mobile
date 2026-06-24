import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { SelectedParameters } from '../../../../UIKit/SelectedParameters';
import { Typography } from '@/UIKit/Typography';
import { CustomInput } from '@/UIKit/CustomInput';
import { RateThisWine } from '@/UIKit/RateThisWine';
import { Notes } from '@/UIKit/Notes';
import { useTastingWineReview } from './presenters/useTastingWineReview';
import { WinePeakPicker } from '@/UIKit/WinePeakPicker/ui';

export const TastingWineReviewView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        review,
        onChangeReview,
        onSliderChange,
        onNextPress,
        onContinueFullTastingPress,
        onFinishTastingPress,
        sliderValue,
        starRate,
        winePeak,
        onStarRateChange,
        onWinePeakChange,
        isSaving,
        isSelectedParametersVisible,
        isFullTastingReview,
        isWinePeakPickerVisible,
        ratingSliderKey,
        ratingStarsKey,
    } = useTastingWineReview();

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('wine.review')} />}
            scrollEnabled
            isKeyboardAvoiding
        >
            <View style={styles.container}>
                <View>
                    <RateThisWine
                        sliderValue={sliderValue}
                        handleSliderChange={onSliderChange}
                        starRate={starRate}
                        onStarRateChange={onStarRateChange}
                        isFullTastingReview={isFullTastingReview}
                        ratingSliderKey={ratingSliderKey}
                        ratingStarsKey={ratingStarsKey}
                    />
                    {isFullTastingReview ? <Notes /> : null}
                    {isWinePeakPickerVisible ? (
                        <WinePeakPicker
                            value={winePeak}
                            onChange={onWinePeakChange}
                            isPremiumLockEnabled={false}
                        />
                    ) : null}
                    <Typography text={t('wine.review')} variant="subtitle_20_500" style={styles.title} />
                    <CustomInput
                        value={review}
                        onChangeText={onChangeReview}
                        autoCapitalize="none"
                        placeholder={t('wine.enterReview')}
                        multiline
                        maxLength={500}
                        containerStyle={styles.inputContainer}
                        inputContainerStyle={styles.input}
                    />

                    {isSelectedParametersVisible ? (
                        <SelectedParameters containerStyle={styles.selectedParameters} />
                    ) : null}
                </View>
                {isFullTastingReview ? (
                    <Button
                        text={t('common.next')}
                        onPress={onNextPress}
                        containerStyle={styles.resultButton}
                        inProgress={isSaving}
                        RightAccessory={<NextLongArrowIcon />}
                    />
                ) : (
                    <View style={styles.buttonsContainer}>
                         <Button
                            text={t('wine.finishTasting')}
                            onPress={onFinishTastingPress}
                            containerStyle={styles.button}
                            type="secondary"
                            disabled={isSaving}
                        />
                        <Button
                            text={t('wine.continueFullTasting')}
                            onPress={onContinueFullTastingPress}
                            containerStyle={styles.button}
                            inProgress={isSaving}
                        />
                    </View>
                )}
            </View>
        </ScreenContainer>
    );
});
