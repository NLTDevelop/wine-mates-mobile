import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { RateMedal } from '@/UIKit/RateMedal/ui';
import { SmallStarRating } from '@/UIKit/SmallStarRating';
import { UniversalPickerBottomModal } from '@/UIKit/UniversalPickerBottomModal';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { IWineEvolutionCarouselCard, IWineEvolutionExpertAssessment } from '@/modules/wine/types/IWineEvolution';
import { EvolutionColorCarouselCard } from '../EvolutionColorCarouselCard';
import { EvolutionLineChartCard } from '../EvolutionLineChartCard';
import { WineEvolutionAmateurRating } from '../WineEvolutionAmateurRating';
import { EvolutionCarouselDots } from '../EvolutionCarouselDots';
import { useWineEvolutionTab } from './presenters/useWineEvolutionTab';
import { getStyles } from './styles';
import { Loader } from '@/UIKit/Loader';

interface IProps {
    wineId: number;
    onRegisterRefresh: (callback: (() => Promise<void>) | null) => void;
}

export const WineEvolutionTab = ({ wineId, onRegisterRefresh }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        tastingYear,
        proAssessmentScore,
        wineLoverScore,
        hasProAssessment,
        hasWineLoverScore,
        winePeakYear,
        winePeakReviews,
        hasWinePeak,
        isInitialLoading,
        isYearPickerVisible,
        yearOptions,
        expertAssessments,
        expertActiveIndex,
        expertCarouselRef,
        onExpertProgressChange,
        onConfigureCarouselPanGesture,
        colorCards,
        colorActiveIndex,
        colorCarouselRef,
        onColorProgressChange,
        colorCarouselHeight,
        onColorCardLayout,
        aromaCards,
        aromaActiveIndex,
        aromaCarouselRef,
        onAromaProgressChange,
        aromaCarouselHeight,
        onAromaCardLayout,
        tasteCards,
        tasteActiveIndex,
        tasteCarouselRef,
        onTasteProgressChange,
        tasteCarouselHeight,
        onTasteCardLayout,
        amateurAgeGroups,
        amateurRatingRows,
        assessmentChart,
        lineCharts,
        carouselItemWidth,
        onYearPress,
        onYearPickerClose,
        onYearConfirm,
    } = useWineEvolutionTab({ colors, wineId, t, onRegisterRefresh });

    const renderExpertItem = useCallback(
        ({ item }: { item: IWineEvolutionExpertAssessment }) => (
            <View style={styles.expertItem}>
                <View style={styles.expertMedalSlot}>
                    {item.proScore === null ? (
                        <Typography text="-" variant="h5" style={styles.expertNoData} />
                    ) : (
                        <RateMedal sliderValue={item.proScore as number} size={54} />
                    )}
                </View>
                <View style={styles.expertStarsSlot}>
                    {item.userScore === null ? (
                        <Typography text="-" variant="h5" style={styles.expertNoData} />
                    ) : (
                        <SmallStarRating rating={item.userScore} starSize={14} />
                    )}
                </View>
                <Typography text={item.year} variant="subtitle_10_400" style={styles.expertYear} />
            </View>
        ),
        [styles],
    );

    const renderColorItem = useCallback(
        ({ item }: { item: IWineEvolutionCarouselCard }) => (
            <EvolutionColorCarouselCard card={item} onLayout={onColorCardLayout} />
        ),
        [onColorCardLayout],
    );

    const renderAromaItem = useCallback(
        ({ item }: { item: IWineEvolutionCarouselCard }) => (
            <EvolutionColorCarouselCard card={item} onLayout={onAromaCardLayout} />
        ),
        [onAromaCardLayout],
    );

    const renderTasteItem = useCallback(
        ({ item }: { item: IWineEvolutionCarouselCard }) => (
            <EvolutionColorCarouselCard card={item} onLayout={onTasteCardLayout} />
        ),
        [onTasteCardLayout],
    );

    return (
        <>
            {isInitialLoading ? (
                <View style={styles.loaderContainer}>
                    <Loader />
                </View>
            ) : (
                <View style={styles.root}>
                    <View style={styles.section}>
                        <Typography text={t('wine.evolution.yearOfTasting')} variant="h4" style={styles.sectionTitle} />
                        <View style={styles.yearContent}>
                            <View style={styles.yearPickerColumn}>
                                <Typography
                                    text={t('wine.evolution.chooseWineYear')}
                                    variant="subtitle_12_400"
                                    style={styles.yearPickerLabel}
                                />
                                <TouchableOpacity style={styles.yearPicker} onPress={onYearPress}>
                                    <Typography
                                        text={tastingYear}
                                        variant="h6"
                                        style={styles.yearText}
                                        numberOfLines={1}
                                    />
                                    <ArrowDownIcon color={colors.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.selectedRatings}>
                                <View style={styles.proAssessment}>
                                    {hasProAssessment ? (
                                        <RateMedal sliderValue={proAssessmentScore as number} size={54} />
                                    ) : (
                                        <Typography text="-" variant="h5" style={styles.proAssessmentNoData} />
                                    )}
                                    <Typography
                                        text={t('wine.evolution.proAssessment')}
                                        variant="subtitle_10_400"
                                        style={styles.proAssessmentLabel}
                                    />
                                </View>
                                <View style={styles.proAssessment}>
                                    {hasWineLoverScore ? (
                                        <SmallStarRating rating={wineLoverScore as number} starSize={16} />
                                    ) : (
                                        <Typography text="-" variant="h5" style={styles.proAssessmentNoData} />
                                    )}
                                    <Typography
                                        text={t('wine.evolution.wineLoversRating')}
                                        variant="subtitle_10_400"
                                        style={styles.proAssessmentLabel}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Typography
                            text={t('wine.evolution.amateurRating')}
                            variant="subtitle_12_500"
                            style={styles.sectionTitle}
                        />
                        <WineEvolutionAmateurRating ageGroups={amateurAgeGroups} rows={amateurRatingRows} />
                    </View>

                    {hasWinePeak ? (
                        <View style={styles.section}>
                            <Typography text={t('wine.evolution.winePeak')} variant="h4" style={styles.sectionTitle} />
                            <View style={styles.winePeakCard}>
                                <Typography text={winePeakYear} variant="h5" style={styles.winePeakYear} />
                                <Typography
                                    text={winePeakReviews}
                                    variant="subtitle_12_400"
                                    style={styles.winePeakReviews}
                                />
                            </View>
                        </View>
                    ) : null}

                    {assessmentChart.series.length ? (
                        <EvolutionLineChartCard chart={assessmentChart} isSummary />
                    ) : null}

                    {expertAssessments.length ? (
                        <View style={styles.section}>
                            <Typography
                                text={t('wine.evolution.tasteDynamicsExpertRatings')}
                                variant="h4"
                                style={styles.sectionTitle}
                            />
                            <Carousel
                                ref={expertCarouselRef}
                                loop={false}
                                overscrollEnabled={false}
                                pagingEnabled={false}
                                snapEnabled
                                width={styles.expertItem.width as number}
                                height={styles.expertCarousel.height as number}
                                style={styles.expertCarousel}
                                data={expertAssessments}
                                onProgressChange={onExpertProgressChange}
                                onConfigurePanGesture={onConfigureCarouselPanGesture}
                                renderItem={renderExpertItem}
                            />
                            <EvolutionCarouselDots count={expertAssessments.length} activeIndex={expertActiveIndex} />
                        </View>
                    ) : null}

                    {colorCards.length ? (
                        <View style={styles.carouselSection}>
                            <View style={styles.carouselHeader}>
                                <Typography
                                    text={t('wine.evolution.color')}
                                    variant="h5"
                                    style={styles.carouselHeaderTitle}
                                />
                            </View>
                            <View style={styles.carouselViewport}>
                                <Carousel
                                    ref={colorCarouselRef}
                                    loop={false}
                                    overscrollEnabled={false}
                                    width={carouselItemWidth}
                                    height={colorCarouselHeight}
                                    style={styles.carousel}
                                    data={colorCards}
                                    onProgressChange={onColorProgressChange}
                                    onConfigurePanGesture={onConfigureCarouselPanGesture}
                                    renderItem={renderColorItem}
                                />
                            </View>
                            <EvolutionCarouselDots count={colorCards.length} activeIndex={colorActiveIndex} />
                        </View>
                    ) : null}

                    {aromaCards.length ? (
                        <View style={styles.carouselSection}>
                            <View style={styles.carouselHeader}>
                                <Typography
                                    text={t('wine.evolution.aroma')}
                                    variant="h5"
                                    style={styles.carouselHeaderTitle}
                                />
                            </View>
                            <View style={styles.carouselViewport}>
                                <Carousel
                                    ref={aromaCarouselRef}
                                    loop={false}
                                    overscrollEnabled={false}
                                    width={carouselItemWidth}
                                    height={aromaCarouselHeight}
                                    style={styles.carousel}
                                    data={aromaCards}
                                    onProgressChange={onAromaProgressChange}
                                    onConfigurePanGesture={onConfigureCarouselPanGesture}
                                    renderItem={renderAromaItem}
                                />
                            </View>
                            <EvolutionCarouselDots count={aromaCards.length} activeIndex={aromaActiveIndex} />
                        </View>
                    ) : null}

                    {tasteCards.length ? (
                        <View style={styles.carouselSection}>
                            <View style={styles.carouselHeader}>
                                <Typography
                                    text={t('wine.evolution.taste')}
                                    variant="h5"
                                    style={styles.carouselHeaderTitle}
                                />
                            </View>
                            <View style={styles.carouselViewport}>
                                <Carousel
                                    ref={tasteCarouselRef}
                                    loop={false}
                                    overscrollEnabled={false}
                                    width={carouselItemWidth}
                                    height={tasteCarouselHeight}
                                    style={styles.carousel}
                                    data={tasteCards}
                                    onProgressChange={onTasteProgressChange}
                                    onConfigurePanGesture={onConfigureCarouselPanGesture}
                                    renderItem={renderTasteItem}
                                />
                            </View>
                            <EvolutionCarouselDots count={tasteCards.length} activeIndex={tasteActiveIndex} />
                        </View>
                    ) : null}

                    {lineCharts.length ? (
                        <View style={styles.metricSection}>
                            <View style={styles.metricSectionHeader}>
                                <Typography
                                    text={t('wine.evolution.tasteCharacteristics')}
                                    variant="h5"
                                    style={styles.metricSectionTitle}
                                />
                            </View>
                            <View style={styles.metricList}>
                                {lineCharts[0] ? <EvolutionLineChartCard chart={lineCharts[0]} /> : null}
                                {lineCharts[1] ? <EvolutionLineChartCard chart={lineCharts[1]} /> : null}
                                {lineCharts[2] ? <EvolutionLineChartCard chart={lineCharts[2]} /> : null}
                                {lineCharts[3] ? <EvolutionLineChartCard chart={lineCharts[3]} /> : null}
                                {lineCharts[4] ? <EvolutionLineChartCard chart={lineCharts[4]} /> : null}
                                {lineCharts[5] ? <EvolutionLineChartCard chart={lineCharts[5]} /> : null}
                            </View>
                        </View>
                    ) : null}
                </View>
            )}
            <UniversalPickerBottomModal
                visible={isYearPickerVisible}
                title={t('wine.selectYear')}
                options={yearOptions}
                isLoading={false}
                selectionMode="single"
                emptyText={t('common.nothingFoundTitle')}
                confirmText={t('common.confirm')}
                onClose={onYearPickerClose}
                onConfirm={onYearConfirm}
            />
        </>
    );
};
