import { useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { RateMedal } from '@/UIKit/RateMedal/ui';
import { SmallStarRating } from '@/UIKit/SmallStarRating';
import { UniversalPickerBottomModal } from '@/UIKit/UniversalPickerBottomModal';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import {
    IWineEvolutionCarouselCard,
    IWineEvolutionChart,
    IWineEvolutionExpertAssessment,
} from '@/modules/wine/types/IWineEvolution';
import { EvolutionColorCarouselCard } from '../EvolutionColorCarouselCard';
import { EvolutionLineChartCard } from '../EvolutionLineChartCard';
import { WineEvolutionAmateurRating } from '../WineEvolutionAmateurRating';
import { EvolutionCarouselDots } from '../EvolutionCarouselDots';
import { useWineEvolutionTab } from './presenters/useWineEvolutionTab';
import { getStyles } from './styles';
import { Loader } from '@/UIKit/Loader';
import { WineLoverRatingBadge } from './components/WineLoverRatingBadge';

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
        wineLoverScoreText,
        wineLoverRatingDescription,
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
        onExpertScroll,
        colorCards,
        colorActiveIndex,
        onColorScroll,
        aromaCards,
        aromaActiveIndex,
        onAromaScroll,
        tasteCards,
        tasteActiveIndex,
        onTasteScroll,
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
                    {item.proScore !== null ? (
                        <RateMedal sliderValue={item.proScore} size={54} />
                    ) : (
                        <Typography text="-" variant="h5" style={styles.expertNoData} />
                    )}
                </View>
                <Typography
                    text={t('wine.evolution.proAssessment')}
                    variant="subtitle_8_400"
                    style={styles.expertRatingLabel}
                />
                {item.userScore !== null ? (
                    <View style={styles.expertWineLoverScore}>
                        <SmallStarRating rating={item.userScore} starSize={16} />
                        <Typography text={`${item.userScoreText}`} variant="subtitle_12_400" style={styles.expertScore} />
                    </View>
                ) : (
                    <Typography text="-" variant="h5" style={styles.expertNoData} />
                )}

                <Typography
                    text={t('wine.evolution.wineLoverRating')}
                    variant="subtitle_8_400"
                    style={styles.expertRatingLabel}
                />
                <Typography text={item.year} variant="subtitle_10_400" style={styles.expertYear} />
            </View>
        ),
        [styles, t],
    );

    const expertKeyExtractor = useCallback((item: IWineEvolutionExpertAssessment) => item.id, []);

    const renderColorItem = useCallback(
        ({ item }: { item: IWineEvolutionCarouselCard }) => <EvolutionColorCarouselCard card={item} />,
        [],
    );

    const renderAromaItem = useCallback(
        ({ item }: { item: IWineEvolutionCarouselCard }) => <EvolutionColorCarouselCard card={item} />,
        [],
    );

    const renderTasteItem = useCallback(
        ({ item }: { item: IWineEvolutionCarouselCard }) => <EvolutionColorCarouselCard card={item} />,
        [],
    );

    const carouselKeyExtractor = useCallback((item: IWineEvolutionCarouselCard) => item.id, []);

    const renderLineChartItem = useCallback(
        ({ item }: { item: IWineEvolutionChart }) => <EvolutionLineChartCard chart={item} />,
        [],
    );

    const lineChartKeyExtractor = useCallback((item: IWineEvolutionChart) => item.id, []);

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
                                        <WineLoverRatingBadge
                                            brand={t('common.logo')}
                                            score={wineLoverScoreText}
                                            description={wineLoverRatingDescription}
                                            textColor={colors.text}
                                            starColor={colors.stars}
                                        />
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

                    <EvolutionLineChartCard chart={assessmentChart} isSummary />

                    {expertAssessments.length ? (
                        <View style={styles.section}>
                            <Typography
                                text={t('wine.evolution.tasteDynamicsExpertRatings')}
                                variant="h4"
                                style={styles.sectionTitle}
                            />
                            <FlatList
                                horizontal
                                data={expertAssessments}
                                renderItem={renderExpertItem}
                                keyExtractor={expertKeyExtractor}
                                contentContainerStyle={styles.expertList}
                                showsHorizontalScrollIndicator={false}
                                onScroll={onExpertScroll}
                                scrollEventThrottle={16}
                            />
                            <EvolutionCarouselDots count={expertAssessments.length} activeIndex={expertActiveIndex} />
                        </View>
                    ) : null}

                    {colorCards.length ? (
                        <View style={styles.carouselSection}>
                            <View style={styles.carouselHeader}>
                                <View style={styles.carouselHeaderText}>
                                    <Typography
                                        text={t('wine.evolution.color')}
                                        variant="h5"
                                        style={styles.carouselHeaderTitle}
                                    />
                                    <Typography
                                        text={t('wine.evolution.colorDescription')}
                                        variant="subtitle_12_400"
                                        style={styles.carouselHeaderDescription}
                                    />
                                </View>
                            </View>
                            <View style={styles.carouselViewport}>
                                <FlatList
                                    horizontal
                                    data={colorCards}
                                    renderItem={renderColorItem}
                                    keyExtractor={carouselKeyExtractor}
                                    contentContainerStyle={styles.carouselList}
                                    showsHorizontalScrollIndicator={false}
                                    snapToInterval={carouselItemWidth}
                                    disableIntervalMomentum
                                    decelerationRate="fast"
                                    onScroll={onColorScroll}
                                    scrollEventThrottle={16}
                                />
                            </View>
                            <EvolutionCarouselDots count={colorCards.length} activeIndex={colorActiveIndex} />
                        </View>
                    ) : null}

                    {aromaCards.length ? (
                        <View style={styles.carouselSection}>
                            <View style={styles.carouselHeader}>
                                <View style={styles.carouselHeaderText}>
                                    <Typography
                                        text={t('wine.evolution.aroma')}
                                        variant="h5"
                                        style={styles.carouselHeaderTitle}
                                    />
                                    <Typography
                                        text={t('wine.evolution.aromaDescription')}
                                        variant="subtitle_12_400"
                                        style={styles.carouselHeaderDescription}
                                    />
                                </View>
                            </View>
                            <View style={styles.carouselViewport}>
                                <FlatList
                                    horizontal
                                    data={aromaCards}
                                    renderItem={renderAromaItem}
                                    keyExtractor={carouselKeyExtractor}
                                    contentContainerStyle={styles.carouselList}
                                    showsHorizontalScrollIndicator={false}
                                    snapToInterval={carouselItemWidth}
                                    disableIntervalMomentum
                                    decelerationRate="fast"
                                    onScroll={onAromaScroll}
                                    scrollEventThrottle={16}
                                />
                            </View>
                            <EvolutionCarouselDots count={aromaCards.length} activeIndex={aromaActiveIndex} />
                        </View>
                    ) : null}

                    {tasteCards.length ? (
                        <View style={styles.carouselSection}>
                            <View style={styles.carouselHeader}>
                                <View style={styles.carouselHeaderText}>
                                    <Typography
                                        text={t('wine.evolution.taste')}
                                        variant="h5"
                                        style={styles.carouselHeaderTitle}
                                    />
                                    <Typography
                                        text={t('wine.evolution.tasteDescription')}
                                        variant="subtitle_12_400"
                                        style={styles.carouselHeaderDescription}
                                    />
                                </View>
                            </View>
                            <View style={styles.carouselViewport}>
                                <FlatList
                                    horizontal
                                    data={tasteCards}
                                    renderItem={renderTasteItem}
                                    keyExtractor={carouselKeyExtractor}
                                    contentContainerStyle={styles.carouselList}
                                    showsHorizontalScrollIndicator={false}
                                    snapToInterval={carouselItemWidth}
                                    disableIntervalMomentum
                                    decelerationRate="fast"
                                    onScroll={onTasteScroll}
                                    scrollEventThrottle={16}
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
                            <FlatList
                                data={lineCharts}
                                renderItem={renderLineChartItem}
                                keyExtractor={lineChartKeyExtractor}
                                contentContainerStyle={styles.metricList}
                                scrollEnabled={false}
                            />
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
