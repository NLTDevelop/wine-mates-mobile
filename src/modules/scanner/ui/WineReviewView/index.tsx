import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { observer } from 'mobx-react-lite';
import { useWineReview } from './presenters/useWineReview';
import { SelectedParameters } from '../../../../UIKit/SelectedParameters';
import { Typography } from '@/UIKit/Typography';
import { CustomInput } from '@/UIKit/CustomInput';
import { RateThisWine } from '@/UIKit/RateThisWine';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { Notes } from '@/UIKit/Notes';
import { WinePeakPicker } from '@/UIKit/WinePeakPicker/ui';

export const WineReviewView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        review,
        onChangeReview,
        onSliderChange,
        onContinueFullTastingPress,
        onFinishTastingPress,
        onResultPress,
        sliderValue,
        starRate,
        winePeak,
        onStarRateChange,
        onWinePeakChange,
        isSaving,
        isFullTastingReview,
        isWinePeakPickerVisible,
    } = useWineReview();

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
                    />
                    {isFullTastingReview && <Notes/>}
                    {isWinePeakPickerVisible ? <WinePeakPicker value={winePeak} onChange={onWinePeakChange} /> : null}
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

                    <SelectedParameters containerStyle={styles.selectedParameters} />
                </View>
                {isFullTastingReview ? (
                    <Button
                        text={t('common.next')}
                        onPress={onResultPress}
                        containerStyle={styles.resultButton}
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
