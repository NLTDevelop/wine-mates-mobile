import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { RateMedal } from '@/UIKit/RateMedal/ui';
import { UniversalPickerBottomModal } from '@/UIKit/UniversalPickerBottomModal';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { IWineEvolutionCarouselCard, IWineEvolutionExpertAssessment } from '@/modules/wine/types/IWineEvolution';
import { EvolutionColorCarouselCard } from '../EvolutionColorCarouselCard';
import { EvolutionLineChartCard } from '../EvolutionLineChartCard';
import { WineEvolutionAmateurRating } from '../WineEvolutionAmateurRating';
import { EvolutionCarouselDots } from '../EvolutionCarouselDots';
import { useWineEvolutionTab } from './presenters/useWineEvolutionTab';
import { getStyles } from './styles';

interface IProps {
    wineId: number;
}

export const WineEvolutionTab = ({ wineId }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        tastingYear,
        proAssessmentScore,
        hasProAssessment,
        winePeakYear,
        winePeakReviews,
        isYearPickerVisible,
        yearOptions,
        expertAssessments,
        expertActiveIndex,
        expertCarouselRef,
        colorCards,
        colorActiveIndex,
        colorCarouselRef,
        aromaCards,
        aromaActiveIndex,
        aromaCarouselRef,
        tasteCards,
        tasteActiveIndex,
        tasteCarouselRef,
        amateurAgeGroups,
        amateurRatingRows,
        assessmentChart,
        lineCharts,
        carouselItemWidth,
        onYearPress,
        onYearPickerClose,
        onYearConfirm,
        onExpertSnap,
        onColorPrevious,
        onColorNext,
        onColorSnap,
        onAromaPrevious,
        onAromaNext,
        onAromaSnap,
        onTastePrevious,
        onTasteNext,
        onTasteSnap,
    } = useWineEvolutionTab({ colors, wineId });

    const renderExpertItem = useCallback(
        ({ item }: { item: IWineEvolutionExpertAssessment }) => (
            <View style={styles.expertItem}>
                {item.score === null ? (
                    <Typography text="-" variant="h5" style={styles.expertNoData} />
                ) : (
                    <RateMedal sliderValue={item.score} size={54} />
                )}
                <Typography text={item.year} variant="subtitle_10_400" style={styles.expertYear} />
            </View>
        ),
        [styles],
    );

    const renderColorItem = useCallback(
        ({ item }: { item: IWineEvolutionCarouselCard }) => <EvolutionColorCarouselCard card={item} />,
        [],
    );

    return (
        <>
            <View style={styles.root}>
                <View style={styles.section}>
                    <Typography text="Year of tasting" variant="h4" style={styles.sectionTitle} />
                    <View style={styles.yearContent}>
                        <View style={styles.yearPickerColumn}>
                            <Typography
                                text="Choose a wine year"
                                variant="subtitle_12_400"
                                style={styles.yearPickerLabel}
                            />
                            <TouchableOpacity style={styles.yearPicker} onPress={onYearPress}>
                                <Typography text={tastingYear} variant="h6" style={styles.yearText} />
                                <ArrowDownIcon color={colors.icon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.proAssessment}>
                            {hasProAssessment ? (
                                <RateMedal sliderValue={proAssessmentScore as number} size={54} />
                            ) : (
                                <Typography text="-" variant="h5" style={styles.proAssessmentNoData} />
                            )}
                            <Typography
                                text="Pro assessment"
                                variant="subtitle_10_400"
                                style={styles.proAssessmentLabel}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Typography text="Taste dynamics & expert ratings" variant="h4" style={styles.sectionTitle} />
                    {expertAssessments.length ? (
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
                            onSnapToItem={onExpertSnap}
                            renderItem={renderExpertItem}
                        />
                    ) : (
                        <View style={[styles.expertCarousel, styles.expertCarouselNoData]}>
                            <Typography text="-" variant="h5" style={styles.expertNoData} />
                        </View>
                    )}
                    <EvolutionCarouselDots count={expertAssessments.length} activeIndex={expertActiveIndex} />
                </View>

                <View style={styles.section}>
                    <Typography text="Amateur rating" variant="h4" style={styles.sectionTitle} />
                    <WineEvolutionAmateurRating ageGroups={amateurAgeGroups} rows={amateurRatingRows} />
                </View>

                <View style={styles.section}>
                    <Typography text="Wine peak" variant="h4" style={styles.sectionTitle} />
                    <View style={styles.winePeakCard}>
                        <Typography text={winePeakYear} variant="h5" style={styles.winePeakYear} />
                        <Typography text={winePeakReviews} variant="subtitle_12_400" style={styles.winePeakReviews} />
                    </View>
                </View>

                <EvolutionLineChartCard chart={assessmentChart} isSummary />

                <View style={styles.carouselSection}>
                    <View style={styles.carouselHeader}>
                        <Typography text="Color" variant="h5" style={styles.carouselHeaderTitle} />
                        <View style={styles.carouselActions}>
                            <TouchableOpacity
                                disabled={colorActiveIndex === 0}
                                onPress={onColorPrevious}
                                style={[
                                    styles.carouselArrow,
                                    colorActiveIndex === 0 ? styles.carouselArrowDisabled : undefined,
                                ]}
                            >
                                <NextArrowIcon rotate={180} color={colors.text_inverted} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onColorNext} style={styles.carouselArrow}>
                                <NextArrowIcon color={colors.text_inverted} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.carouselViewport}>
                        <Carousel
                            ref={colorCarouselRef}
                            loop={false}
                            overscrollEnabled={false}
                            width={carouselItemWidth}
                            height={styles.carousel.height as number}
                            style={styles.carousel}
                            data={colorCards}
                            onSnapToItem={onColorSnap}
                            renderItem={renderColorItem}
                        />
                    </View>
                    <EvolutionCarouselDots count={colorCards.length} activeIndex={colorActiveIndex} />
                </View>

                <View style={styles.carouselSection}>
                    <View style={styles.carouselHeader}>
                        <Typography text="Aroma" variant="h5" style={styles.carouselHeaderTitle} />
                        <View style={styles.carouselActions}>
                            <TouchableOpacity
                                disabled={aromaActiveIndex === 0}
                                onPress={onAromaPrevious}
                                style={[
                                    styles.carouselArrow,
                                    aromaActiveIndex === 0 ? styles.carouselArrowDisabled : undefined,
                                ]}
                            >
                                <NextArrowIcon rotate={180} color={colors.text_inverted} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onAromaNext} style={styles.carouselArrow}>
                                <NextArrowIcon color={colors.text_inverted} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.carouselViewport}>
                        <Carousel
                            ref={aromaCarouselRef}
                            loop={false}
                            overscrollEnabled={false}
                            width={carouselItemWidth}
                            height={styles.carousel.height as number}
                            style={styles.carousel}
                            data={aromaCards}
                            onSnapToItem={onAromaSnap}
                            renderItem={renderColorItem}
                        />
                    </View>
                    <EvolutionCarouselDots count={aromaCards.length} activeIndex={aromaActiveIndex} />
                </View>

                <View style={styles.carouselSection}>
                    <View style={styles.carouselHeader}>
                        <Typography text="Taste" variant="h5" style={styles.carouselHeaderTitle} />
                        <View style={styles.carouselActions}>
                            <TouchableOpacity
                                disabled={tasteActiveIndex === 0}
                                onPress={onTastePrevious}
                                style={[
                                    styles.carouselArrow,
                                    tasteActiveIndex === 0 ? styles.carouselArrowDisabled : undefined,
                                ]}
                            >
                                <NextArrowIcon rotate={180} color={colors.text_inverted} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onTasteNext} style={styles.carouselArrow}>
                                <NextArrowIcon color={colors.text_inverted} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.carouselViewport}>
                        <Carousel
                            ref={tasteCarouselRef}
                            loop={false}
                            overscrollEnabled={false}
                            width={carouselItemWidth}
                            height={styles.carousel.height as number}
                            style={styles.carousel}
                            data={tasteCards}
                            onSnapToItem={onTasteSnap}
                            renderItem={renderColorItem}
                        />
                    </View>
                    <EvolutionCarouselDots count={tasteCards.length} activeIndex={tasteActiveIndex} />
                </View>

                <View style={styles.metricSection}>
                    <View style={styles.metricSectionHeader}>
                        <Typography text="Taste characteristics" variant="h5" style={styles.metricSectionTitle} />
                    </View>
                    <View style={styles.metricList}>
                        <EvolutionLineChartCard chart={lineCharts[0]} />
                        <EvolutionLineChartCard chart={lineCharts[1]} />
                        <EvolutionLineChartCard chart={lineCharts[2]} />
                        <EvolutionLineChartCard chart={lineCharts[3]} />
                        <EvolutionLineChartCard chart={lineCharts[4]} />
                        <EvolutionLineChartCard chart={lineCharts[5]} />
                    </View>
                </View>
            </View>
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
