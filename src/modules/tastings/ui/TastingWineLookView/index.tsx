import { useMemo } from 'react';
import { getStyles, WineSliderColors } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { Loader } from '@/UIKit/Loader';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { SmoothSlider } from '@/UIKit/SmoothSlider';
import { ScrollViewIndicator } from '@fanchenbao/react-native-scroll-indicator';
import { ShadeSelector } from '@/UIKit/ShadeSelector';
import { SelectedParameters } from '@/UIKit/SelectedParameters';
import { useTastingWineLook } from './presenters/useTastingWineLook';
import { ColorSelector } from '@/UIKit/ColorSelector';
import { wineModel } from '@/entities/wine/models/WineModel';

export const TastingWineLookView = observer(() => {
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
        isSaving,
        onSelectColor,
        onPressNext,
        appearance,
        setAppearance,
        shadeSelectorKey,
        onShadeAnimationEnd,
        getSparklingSliderData,
        currentColor,
        isSelectedParametersVisible,
    } = useTastingWineLook({ t, styles });

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
                headerComponent={<HeaderWithBackButton title={t('wine.look')} />}
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
                                onAnimationEnd={onShadeAnimationEnd}
                            />

                            {wineModel.base?.typeOfWine.isSparkling && (
                                <View style={styles.sliderContainer}>
                                    <View>
                                        <Typography text={t('wine.selectMousse')} variant="h4" style={styles.sparklingLabel} />
                                        <Typography text={t('muse.description')} variant="subtitle_12_400" style={styles.sparklingDescription} />
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
                                        <Typography text={t('wine.selectPerlage')} variant="h4" style={styles.sparklingLabel} />
                                        <Typography text={t('perlage.description')} variant="subtitle_12_400" style={styles.sparklingDescription} />
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
                                        <Typography text={t('wine.selectAppearance')} variant="h4" style={styles.sparklingLabel} />
                                        <Typography text={t('wineView.description')} variant="subtitle_12_400" style={styles.sparklingDescription} />
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

                            {isSelectedParametersVisible && <SelectedParameters />}
                        </ScrollViewIndicator>
                        <Button
                            text={t('wine.letsSmell')}
                            onPress={onPressNext}
                            inProgress={isSaving}
                            containerStyle={styles.button}
                            RightAccessory={<NextLongArrowIcon />}
                        />
                    </View>
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
