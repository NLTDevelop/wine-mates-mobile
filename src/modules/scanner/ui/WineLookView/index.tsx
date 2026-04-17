import { useMemo } from 'react';
import { getStyles, WineSliderColors } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { ColorSelector } from './components/ColorSelector';
import { useWineLook } from '../../presenters/useWineLook';
import { ShadeSelector } from '../components/ShadeSelector';
import { CloseButton } from '../components/CloseButton';
import { SelectedParameters } from '../components/SelectedParameters';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { Loader } from '@/UIKit/Loader';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { wineModel } from '@/entities/wine/WineModel';
import { SmoothSlider } from '@/UIKit/SmoothSlider';
import { ScrollViewIndicator } from '@fanchenbao/react-native-scroll-indicator';

export const WineLookView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        data,
        selectedColor,
        perlage,
        setPerlage,
        mousse,
        setMousse,
        shade,
        setShade,
        isError,
        getColorsWithShades,
        isLoading,
        onSelectColor,
        handlePressNext,
        appearance,
        setAppearance,
        shadeSelectorKey,
        handleShadeAnimationEnd,
        getSparklingSliderData,
        currentColor,
    } = useWineLook({ t, styles });

    const decorator = useMemo(() => {
        return {
            item: <View style={styles.decoratorItem} />,
            count: 3,
        };
    }, [styles.decoratorItem]);


    return (
        <WithErrorHandler
            error={isError ? ErrorTypeEnum.ERROR : null}
            onRetry={getColorsWithShades}
            isLoading={isLoading}
        >
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.look')} rightComponent={<CloseButton />} />}
            >
                {!data || !selectedColor || isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <ScrollViewIndicator
                            containerStyle={styles.scrollArea}
                            indStyle={styles.indicator}
                            scrollViewProps={{
                                style: styles.scrollView,
                                contentContainerStyle: styles.scrollContent,
                                keyboardShouldPersistTaps: 'handled',
                            }}
                        >
                            <Typography text={t('wine.lookDescription')} variant="body_400" style={styles.title} />

                            <Typography text={t('wine.selectColor')} variant="h4" style={styles.label} />
                            <ColorSelector
                                data={data}
                                selectedColor={selectedColor}
                                onSelectColor={onSelectColor}
                            />

                            <Typography text={t('wine.result')} variant="h4" style={styles.label} />
                            <View style={[styles.resultContainer, { backgroundColor: currentColor }]} />

                            <Typography text={t('wine.selectShade')} variant="h4" style={styles.label} />
                            <ShadeSelector
                                key={shadeSelectorKey}
                                value={shade}
                                onChange={setShade}
                                colorShades={selectedColor}
                                onAnimationEnd={handleShadeAnimationEnd}
                            />

                            {wineModel.base?.typeOfWine.isSparkling && (
                                <View style={styles.sliderContainer}>
                                    <View>
                                        <Typography text={t('wine.selectMousse')} variant="h4" style={styles.label} />
                                        <SmoothSlider
                                            value={mousse}
                                            onChange={setMousse}
                                            min={0}
                                            max={4}
                                            step={1}
                                            snapped
                                            labels={getSparklingSliderData.mousseData}
                                            containerStyle={styles.smoothSlider}
                                            selectedStyle={{ backgroundColor: WineSliderColors.MOUSSE }}
                                            decorator={decorator}
                                        />
                                    </View>
                                    <View>
                                        <Typography text={t('wine.selectPerlage')} variant="h4" style={styles.label} />
                                        <SmoothSlider
                                            value={perlage}
                                            onChange={setPerlage}
                                            min={0}
                                            max={4}
                                            step={1}
                                            snapped
                                            labels={getSparklingSliderData.perlageData}
                                            containerStyle={styles.smoothSlider}
                                            selectedStyle={{ backgroundColor: WineSliderColors.PERLAGE }}
                                            decorator={decorator}
                                        />
                                    </View>
                                    <View>
                                        <Typography text={t('wine.selectAppearance')} variant="h4" style={styles.label} />
                                        <SmoothSlider
                                            value={appearance}
                                            onChange={setAppearance}
                                            min={0}
                                            max={4}
                                            step={1}
                                            snapped
                                            labels={getSparklingSliderData.appearanceData}
                                            containerStyle={styles.smoothSlider}
                                            selectedStyle={{ backgroundColor: WineSliderColors.CLARITY }}
                                            decorator={decorator}
                                        />
                                    </View>
                                </View>
                            )}

                            <SelectedParameters />
                        </ScrollViewIndicator>
                        <Button
                            text={t('wine.letsSmell')}
                            onPress={handlePressNext}
                            containerStyle={styles.button}
                            RightAccessory={<NextLongArrowIcon />}
                        />
                    </View>
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
