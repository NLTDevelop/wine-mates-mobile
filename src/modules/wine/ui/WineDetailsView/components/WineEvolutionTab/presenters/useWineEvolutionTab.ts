import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import { getContrastColor, scaleHorizontal } from '@/utils';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';
import { IColors } from '@/UIProvider/theme/IColors';
import { wineService } from '@/entities/wine/services/WineService';
import {
    IWineEvolutionStatistic,
    IWineEvolutionTasteCharacteristic,
    IWineEvolutionVintage,
} from '@/entities/wine/types/IWineEvolution';
import {
    IWineEvolutionCarouselCard,
    IWineEvolutionChart,
    IWineEvolutionColorStat,
    IWineEvolutionExpertAssessment,
    IWineEvolutionLineSeries,
    IWineEvolutionRatingRow,
} from '@/modules/wine/types/IWineEvolution';

const NO_DATA = '-';
const NO_VINTAGE = 'Non-vintage';

const getChartColors = (colors: IColors) => [
    colors.evolutionChartRed,
    colors.evolutionChartGreen,
    colors.evolutionChartBlue,
    colors.evolutionChartYellow,
    colors.evolutionChartPurple,
    colors.evolutionChartOrange,
];

const AMATEUR_AGE_GROUPS = ['18-25', '26-35', '36-45', '46-60', '60+'];
const AMATEUR_AGE_KEYS = ['18_25', '26_35', '36_45', '46_60', '60_plus'] as const;

const EMPTY_CHART_TITLES = ['Sweetness', 'Acidity', 'Tannin', 'Body', 'Aftertaste', 'Alcohol'];
const MOCK_AVATAR_SOURCES = [
    require('@assets/images/wine_evolution_avatars/wine_evolution_avatar_1.png'),
    require('@assets/images/wine_evolution_avatars/wine_evolution_avatar_2.png'),
    require('@assets/images/wine_evolution_avatars/wine_evolution_avatar_3.png'),
];

const formatScore = (value: number | null) => (value === null ? NO_DATA : value.toFixed(1));
const formatVintage = (vintage: number | null) => (vintage === null ? NO_VINTAGE : `${vintage}`);

const createEmptyRatingRows = (): IWineEvolutionRatingRow[] =>
    ['Men', 'Women'].map(label => ({
        label,
        ratings: AMATEUR_AGE_GROUPS.map(() => ({
            score: null,
            reviews: 0,
            scoreText: NO_DATA,
            reviewsText: NO_DATA,
        })),
    }));

const createEvolutionRatingRows = (item: IWineEvolutionVintage): IWineEvolutionRatingRow[] => {
    return [
        {
            label: 'Men',
            ratings: AMATEUR_AGE_KEYS.map(ageKey => ({
                score: item.ratingByGroup.men[ageKey].avg,
                reviews: item.ratingByGroup.men[ageKey].count,
                scoreText: formatScore(item.ratingByGroup.men[ageKey].avg),
                reviewsText:
                    item.ratingByGroup.men[ageKey].avg === null ? NO_DATA : `(${item.ratingByGroup.men[ageKey].count})`,
            })),
        },
        {
            label: 'Women',
            ratings: AMATEUR_AGE_KEYS.map(ageKey => ({
                score: item.ratingByGroup.women[ageKey].avg,
                reviews: item.ratingByGroup.women[ageKey].count,
                scoreText: formatScore(item.ratingByGroup.women[ageKey].avg),
                reviewsText:
                    item.ratingByGroup.women[ageKey].avg === null
                        ? NO_DATA
                        : `(${item.ratingByGroup.women[ageKey].count})`,
            })),
        },
    ];
};

const createEvolutionStatistic = (item: IWineEvolutionStatistic, fallbackColor: string): IWineEvolutionColorStat => ({
    label: item.name,
    reviews: item.userCount,
    reviewsText: `(${item.userCount} Reviews)`,
    backgroundColor: item.colorHex ?? fallbackColor,
    textColor: getContrastColor(item.colorHex ?? fallbackColor),
});

const createEvolutionCarouselCards = (
    data: IWineEvolutionVintage[],
    getStatistics: (item: IWineEvolutionVintage) => IWineEvolutionStatistic[],
    fallbackColors: string[],
): IWineEvolutionCarouselCard[] => {
    return data.map((item, index) => {
        const statistics = getStatistics(item).slice(0, 5);
        const peopleCount = statistics.reduce((total, statistic) => total + statistic.userCount, 0);

        return {
            id: `evolution-card-${item.vintage ?? 'none'}-${index}`,
            year: formatVintage(item.vintage),
            colors: statistics.map((statistic, statisticIndex) =>
                createEvolutionStatistic(statistic, fallbackColors[statisticIndex % fallbackColors.length]),
            ),
            avatarSources: MOCK_AVATAR_SOURCES,
            additionalPeople: peopleCount,
            additionalPeopleText: peopleCount ? `+${peopleCount}` : '',
            isEmpty: statistics.length === 0,
        };
    });
};

const createEmptyCarouselCard = (id: string): IWineEvolutionCarouselCard => ({
    id,
    year: NO_DATA,
    colors: [],
    avatarSources: [],
    additionalPeople: 0,
    additionalPeopleText: '',
    isEmpty: true,
});

const createEvolutionExpertAssessments = (data: IWineEvolutionVintage[]): IWineEvolutionExpertAssessment[] => {
    return data.map((item, index) => ({
        id: `expert-${item.vintage ?? 'none'}-${index}`,
        year: formatVintage(item.vintage),
        score: item.avgExpertRating,
    }));
};

const createSeries = (
    id: string,
    values: Array<number | null>,
    color: string,
    minValue: number,
    maxValue: number,
    plotWidth: number,
    plotHeight: number,
): IWineEvolutionLineSeries => {
    const points = values.map((value, index) => {
        if (value === null) {
            return null;
        }

        const x = values.length > 1 ? (plotWidth / (values.length - 1)) * index : 0;
        const valueRange = maxValue - minValue || 1;
        const y = plotHeight - ((value - minValue) / valueRange) * plotHeight;

        return { x, y };
    });

    const pathParts: string[] = [];
    let currentSegment: string[] = [];

    points.forEach(point => {
        if (!point) {
            if (currentSegment.length) {
                pathParts.push(currentSegment.join(' '));
                currentSegment = [];
            }

            return;
        }

        currentSegment.push(`${currentSegment.length ? 'L' : 'M'} ${point.x} ${point.y}`);
    });

    if (currentSegment.length) {
        pathParts.push(currentSegment.join(' '));
    }

    const validPoints = points.filter((point): point is { x: number; y: number } => point !== null);

    return {
        id,
        color,
        path: pathParts.join(' '),
        lastPoint: validPoints[validPoints.length - 1],
    };
};

const createChart = (
    id: string,
    title: string,
    yAxisLabels: string[],
    values: Array<number | null>,
    color: string,
    minValue: number,
    maxValue: number,
    plotWidth: number,
    plotHeight: number,
    gridY: number[],
    xAxisLabels: string[],
): IWineEvolutionChart => ({
    id,
    title,
    yAxisLabels,
    xAxisLabels,
    gridY,
    plotWidth,
    plotHeight,
    strokeWidth: 1.5,
    series: values.some(value => value !== null)
        ? [createSeries(id, values, color, minValue, maxValue, plotWidth, plotHeight)]
        : [],
});

const getCharacteristicDefinitions = (data: IWineEvolutionVintage[]) => {
    const definitions: IWineEvolutionTasteCharacteristic[] = [];

    data.forEach(item => {
        item.tasteCharacteristics.forEach(characteristic => {
            if (!definitions.some(definition => definition.characteristicId === characteristic.characteristicId)) {
                definitions.push(characteristic);
            }
        });
    });

    return definitions;
};

const getCharacteristicLevels = (characteristic: IWineEvolutionTasteCharacteristic) =>
    [...characteristic.levels].sort((first, second) => second.sortNumber - first.sortNumber);

const getGridLines = (height: number, labelsCount: number) => {
    if (labelsCount <= 1) {
        return [height / 2];
    }

    return Array.from({ length: labelsCount }, (_, index) => (height / (labelsCount - 1)) * index);
};

const createEvolutionLineCharts = (
    data: IWineEvolutionVintage[],
    chartColors: string[],
    plotWidth: number,
): IWineEvolutionChart[] => {
    const chartYears = data.map(item => formatVintage(item.vintage));
    const compactPlotHeight = 193;
    const characteristics = getCharacteristicDefinitions(data).slice(0, EMPTY_CHART_TITLES.length);
    const chartDefinitions = EMPTY_CHART_TITLES.map((emptyTitle, index) => characteristics[index] ?? null);

    return chartDefinitions.map((characteristic, index) => {
        if (!characteristic) {
            return createChart(
                `empty-${index}`,
                EMPTY_CHART_TITLES[index],
                [NO_DATA],
                [],
                chartColors[index % chartColors.length],
                0,
                1,
                plotWidth,
                compactPlotHeight,
                [compactPlotHeight / 2],
                chartYears,
            );
        }

        const levels = getCharacteristicLevels(characteristic);
        const yAxisLabels = levels.length ? levels.map(level => level.name) : [NO_DATA];
        const minValue = levels.length ? levels[levels.length - 1].sortNumber : 0;
        const maxValue = levels.length ? levels[0].sortNumber : 1;
        const values = data.map(
            item =>
                item.tasteCharacteristics.find(
                    itemCharacteristic => itemCharacteristic.characteristicId === characteristic.characteristicId,
                )?.avgSortNumber ?? null,
        );

        return createChart(
            `characteristic-${characteristic.characteristicId}`,
            characteristic.name,
            yAxisLabels,
            values,
            characteristic.colorHex ?? chartColors[index % chartColors.length],
            minValue,
            maxValue,
            plotWidth,
            compactPlotHeight,
            getGridLines(compactPlotHeight, yAxisLabels.length),
            chartYears,
        );
    });
};

const createEvolutionAssessmentChart = (
    data: IWineEvolutionVintage[],
    chartColors: string[],
    plotWidth: number,
    audienceVisibility: { men: boolean; women: boolean },
    onMenToggle: () => void,
    onWomenToggle: () => void,
): IWineEvolutionChart => {
    const ageKeys = AMATEUR_AGE_KEYS;
    const groupSeries = [
        ...ageKeys.map((ageKey, index) => ({ id: `men-${ageKey}`, group: 'men' as const, ageKey, colorIndex: index })),
        ...ageKeys.map((ageKey, index) => ({
            id: `women-${ageKey}`,
            group: 'women' as const,
            ageKey,
            colorIndex: index,
        })),
    ];
    const plotHeight = 282;

    return {
        id: 'assessment-over-years',
        title: 'Dynamics of the assessment over the years',
        yAxisLabels: ['5', '4', '3', '2', '1', '0'],
        xAxisLabels: data.map(item => formatVintage(item.vintage)),
        gridY: [16, 66, 116, 166, 216, 266],
        plotWidth,
        plotHeight,
        strokeWidth: 1.5,
        series: data.length
            ? groupSeries
                  .filter(series => audienceVisibility[series.group])
                  .flatMap(series => {
                      const values = data.map(item => item.ratingByGroup[series.group][series.ageKey].avg);

                      return values.some(value => value !== null)
                          ? [
                                createSeries(
                                    `assessment-${series.id}`,
                                    values,
                                    chartColors[series.colorIndex % chartColors.length],
                                    0,
                                    5,
                                    plotWidth,
                                    plotHeight,
                                ),
                            ]
                          : [];
                  })
            : [],
        audienceControls: [
            { id: 'men', title: 'Men', isActive: audienceVisibility.men, onPress: onMenToggle },
            { id: 'women', title: 'Women', isActive: audienceVisibility.women, onPress: onWomenToggle },
        ],
    };
};

interface IProps {
    colors: IColors;
    wineId: number;
}

export const useWineEvolutionTab = ({ colors, wineId }: IProps) => {
    const [evolutionData, setEvolutionData] = useState<IWineEvolutionVintage[]>([]);
    const [isEvolutionLoading, setIsEvolutionLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(NO_DATA);
    const [draftYear, setDraftYear] = useState(NO_DATA);
    const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);
    const [expertActiveIndex, setExpertActiveIndex] = useState(0);
    const [colorActiveIndex, setColorActiveIndex] = useState(0);
    const [aromaActiveIndex, setAromaActiveIndex] = useState(0);
    const [tasteActiveIndex, setTasteActiveIndex] = useState(0);
    const [audienceVisibility, setAudienceVisibility] = useState({ men: true, women: true });

    const expertCarouselRef = useRef<ICarouselInstance>(null);
    const colorCarouselRef = useRef<ICarouselInstance>(null);
    const aromaCarouselRef = useRef<ICarouselInstance>(null);
    const tasteCarouselRef = useRef<ICarouselInstance>(null);

    const carouselItemWidth = scaleHorizontal(233);
    const graphPlotWidth = 276;
    const chartColors = useMemo(() => getChartColors(colors), [colors]);
    useEffect(() => {
        let isActive = true;

        const getEvolution = async () => {
            setIsEvolutionLoading(true);
            const response = await wineService.getEvolution(wineId);

            if (!isActive) {
                return;
            }

            setEvolutionData(response.isError || !response.data ? [] : response.data);
            setIsEvolutionLoading(false);
        };

        getEvolution();

        return () => {
            isActive = false;
        };
    }, [wineId]);

    const evolutionYears = useMemo(() => {
        const years = evolutionData.map(item => formatVintage(item.vintage));

        return years.length ? years : [NO_DATA];
    }, [evolutionData]);

    const activeYear = evolutionYears.includes(selectedYear) ? selectedYear : evolutionYears[0];
    const activeDraftYear = evolutionYears.includes(draftYear) ? draftYear : activeYear;

    const selectedEvolution = useMemo(() => {
        return evolutionData.find(item => formatVintage(item.vintage) === activeYear);
    }, [activeYear, evolutionData]);

    const onYearPress = useCallback(() => {
        setDraftYear(activeYear);
        setIsYearPickerVisible(true);
    }, [activeYear]);

    const onYearPickerClose = useCallback(() => {
        setIsYearPickerVisible(false);
    }, []);

    const onYearSelect = useCallback((year: string) => {
        return () => {
            setDraftYear(year);
        };
    }, []);

    const yearOptions = useMemo<IUniversalPickerOption[]>(() => {
        return evolutionYears.map(year => ({
            id: year,
            title: year,
            isSelected: activeDraftYear === year,
            onPress: onYearSelect(year),
        }));
    }, [activeDraftYear, evolutionYears, onYearSelect]);

    const onYearConfirm = useCallback(() => {
        setSelectedYear(activeDraftYear);
        setIsYearPickerVisible(false);
    }, [activeDraftYear]);

    const onColorPrevious = useCallback(() => {
        colorCarouselRef.current?.prev({ animated: true });
    }, []);

    const onColorNext = useCallback(() => {
        colorCarouselRef.current?.next({ animated: true });
    }, []);

    const onAromaPrevious = useCallback(() => {
        aromaCarouselRef.current?.prev({ animated: true });
    }, []);

    const onAromaNext = useCallback(() => {
        aromaCarouselRef.current?.next({ animated: true });
    }, []);

    const onTastePrevious = useCallback(() => {
        tasteCarouselRef.current?.prev({ animated: true });
    }, []);

    const onTasteNext = useCallback(() => {
        tasteCarouselRef.current?.next({ animated: true });
    }, []);

    const onExpertSnap = useCallback((index: number) => {
        setExpertActiveIndex(index);
    }, []);

    const onColorSnap = useCallback((index: number) => {
        setColorActiveIndex(index);
    }, []);

    const onAromaSnap = useCallback((index: number) => {
        setAromaActiveIndex(index);
    }, []);

    const onTasteSnap = useCallback((index: number) => {
        setTasteActiveIndex(index);
    }, []);

    const onMenToggle = useCallback(() => {
        setAudienceVisibility(current => ({ ...current, men: !current.men }));
    }, []);

    const onWomenToggle = useCallback(() => {
        setAudienceVisibility(current => ({ ...current, women: !current.women }));
    }, []);

    const connectedLineCharts = useMemo(
        () => createEvolutionLineCharts(evolutionData, chartColors, graphPlotWidth),
        [chartColors, evolutionData, graphPlotWidth],
    );

    const connectedAssessmentChart = useMemo(
        () =>
            createEvolutionAssessmentChart(
                evolutionData,
                chartColors,
                graphPlotWidth,
                audienceVisibility,
                onMenToggle,
                onWomenToggle,
            ),
        [audienceVisibility, chartColors, evolutionData, graphPlotWidth, onMenToggle, onWomenToggle],
    );

    const expertAssessments = useMemo(() => createEvolutionExpertAssessments(evolutionData), [evolutionData]);

    const connectedColorCards = useMemo(() => {
        return evolutionData.length
            ? createEvolutionCarouselCards(evolutionData, item => item.topColors, chartColors)
            : [createEmptyCarouselCard('color-empty')];
    }, [chartColors, evolutionData]);

    const connectedAromaCards = useMemo(() => {
        return evolutionData.length
            ? createEvolutionCarouselCards(evolutionData, item => item.topAromas, chartColors)
            : [createEmptyCarouselCard('aroma-empty')];
    }, [chartColors, evolutionData]);

    const connectedTasteCards = useMemo(() => {
        return evolutionData.length
            ? createEvolutionCarouselCards(
                  evolutionData,
                  item =>
                      item.tasteCharacteristics.map(characteristic => ({
                          id: characteristic.characteristicId,
                          name: characteristic.name,
                          colorHex: characteristic.colorHex,
                          userCount: characteristic.userCount,
                      })),
                  chartColors,
              )
            : [createEmptyCarouselCard('taste-empty')];
    }, [chartColors, evolutionData]);

    const safeExpertActiveIndex = Math.min(expertActiveIndex, Math.max(expertAssessments.length - 1, 0));
    const safeColorActiveIndex = Math.min(colorActiveIndex, Math.max(connectedColorCards.length - 1, 0));
    const safeAromaActiveIndex = Math.min(aromaActiveIndex, Math.max(connectedAromaCards.length - 1, 0));
    const safeTasteActiveIndex = Math.min(tasteActiveIndex, Math.max(connectedTasteCards.length - 1, 0));

    const amateurRatingRows = useMemo(
        () => (selectedEvolution ? createEvolutionRatingRows(selectedEvolution) : createEmptyRatingRows()),
        [selectedEvolution],
    );
    const proAssessmentScore = selectedEvolution?.avgExpertRating ?? null;
    const selectedWinePeak = selectedEvolution?.winePeaks[0];
    const winePeakYear = selectedWinePeak ? `${selectedWinePeak.year}` : NO_DATA;
    const winePeakReviews = selectedWinePeak ? `(${selectedWinePeak.userCount} Reviews)` : NO_DATA;

    return {
        tastingYear: activeYear,
        proAssessmentScore,
        winePeakYear,
        winePeakReviews,
        hasProAssessment: proAssessmentScore !== null,
        isEvolutionLoading,
        isYearPickerVisible,
        yearOptions,
        expertAssessments,
        expertActiveIndex: safeExpertActiveIndex,
        expertCarouselRef,
        colorCards: connectedColorCards,
        colorActiveIndex: safeColorActiveIndex,
        colorCarouselRef,
        aromaCards: connectedAromaCards,
        aromaActiveIndex: safeAromaActiveIndex,
        aromaCarouselRef,
        tasteCards: connectedTasteCards,
        tasteActiveIndex: safeTasteActiveIndex,
        tasteCarouselRef,
        amateurAgeGroups: AMATEUR_AGE_GROUPS,
        amateurRatingRows,
        assessmentChart: connectedAssessmentChart,
        lineCharts: connectedLineCharts,
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
    };
};
