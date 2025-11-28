import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@/assets/icons/NextLongArrowIcon';
import { useWineReview } from '../../presenters/useWineReview';
import { SelectedParameters } from '../components/SelectedParameters';
import { Typography } from '@/UIKit/Typography';
import { CustomInput } from '@/UIKit/CustomInput';
import { RateThisWine } from '../components/RateThisWine';
import { Notes } from '../components/Notes';

export const WineReviewView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { review, onChangeReview, handleSliderChange, handleNextPress, sliderValue, isPremiumUser, isOpened,
        toggleNotes } = useWineReview();

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
                    <RateThisWine isPremiumUser={isPremiumUser} sliderValue={sliderValue} handleSliderChange={handleSliderChange}/>
                    <Notes isOpened={isOpened} toggleNotes={toggleNotes}/>
                    <Typography text={t('wine.review')} variant="subtitle_20_500" style={styles.title} />
                    <CustomInput
                        value={review}
                        onChangeText={onChangeReview}
                        autoCapitalize="none"
                        placeholder={t('wine.enterReview')}
                        multiline
                        containerStyle={styles.inputContainer}
                        inputContainerStyle={styles.input}
                    />

                    <SelectedParameters containerStyle={styles.selectedParameters} />
                </View>
                <Button
                    text={t('common.next')}
                    onPress={handleNextPress}
                    containerStyle={styles.button}
                    RightAccessory={<NextLongArrowIcon />}
                />
            </View>
        </ScreenContainer>
    );
});
