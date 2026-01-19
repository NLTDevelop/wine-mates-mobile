import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { ColorButton } from '../components/ColorButton';
import { useWineLook } from '../../presenters/useWineLook';
import { ShadeSelector } from '../components/ShadeSelector';
import { CloseButton } from '../components/CloseButton';
import { SelectedParameters } from '../components/SelectedParameters';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';
import { Loader } from '@/UIKit/Loader';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { wineModel } from '@/entities/wine/WineModel';
import { SmoothSlider } from '@/UIKit/SmoothSlider';

export const WineLookView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, selectedColor, perlage, setPerlage, mousse, setMousse, shade, setShade, isError, getColorsWithShades,
        currentColor, isLoading, onSelectColor, handlePressNext, appearance, setAppearance, shadeSelectorKey, handleShadeAnimationEnd } = useWineLook();

    console.log(wineModel.base?.typeOfWine.isSparkling);

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
                scrollEnabled
            >
                {!data || !selectedColor || isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <View>
                            <Typography text={t('wine.lookDescription')} variant="body_400" style={styles.title} />

                            <Typography text={t('wine.selectColor')} variant="h4" style={styles.label} />
                            <View style={styles.colorsContainer}>
                                {data.map((item: IWineColorShade, index: number) => (
                                    <ColorButton
                                        key={index}
                                        color={item}
                                        isActive={item.id === selectedColor?.id}
                                        onPress={() => onSelectColor(item)}
                                    />
                                ))}
                            </View>

                            <Typography text={t('wine.result')} variant="h4" style={styles.label} />
                            <View style={[styles.resultColor, { backgroundColor: currentColor }]} />

                            <Typography text={t('wine.selectShade')} variant="h4" style={styles.label} />
                            <ShadeSelector
                                key={shadeSelectorKey}
                                value={shade}
                                onChange={setShade}
                                colorShades={selectedColor}
                                onAnimationEnd={handleShadeAnimationEnd}
                            />

                            {true && (
                                <>
                                    <Typography text={t('wine.selectMousse')} variant="h4" style={styles.label} />
                                    <SmoothSlider
                                        value={mousse}
                                        onChange={setMousse}
                                        min={0}
                                        max={4}
                                        step={1}
                                        snapped
                                        labels={[t('muse.missing'), t('muse.creamy'), t('muse.moderate')]}
                                        containerStyle={styles.smoothSlider}
                                        trackStyle={styles.track}
                                        selectedStyle={styles.selected}
                                    />

                                    <Typography text={t('wine.selectPerlage')} variant="h4" style={styles.label} />
                                    <SmoothSlider
                                        value={perlage}
                                        onChange={setPerlage}
                                        min={0}
                                        max={4}
                                        step={1}
                                        snapped
                                        labels={[t('perlage.coarse'), t('perlage.thin'), t('perlage.small')]}
                                        containerStyle={styles.smoothSlider}
                                        trackStyle={styles.track}
                                        selectedStyle={styles.selected}
                                    />

                                    <Typography text={t('wine.selectAppearance')} variant="h4" style={styles.label} />
                                    <SmoothSlider
                                        value={appearance}
                                        onChange={setAppearance}
                                        min={0}
                                        max={4}
                                        step={1}
                                        snapped
                                        labels={[t('wineView.cloudy'), t('wineView.sparklingClean'), t('wineView.translucent')]}
                                        containerStyle={styles.smoothSlider}
                                        trackStyle={styles.track}
                                        selectedStyle={styles.selected}
                                    />
                                </>
                            )}

                            <SelectedParameters />
                        </View>
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
