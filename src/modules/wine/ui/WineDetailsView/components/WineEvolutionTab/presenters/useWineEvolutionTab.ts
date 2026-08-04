import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import type { PanGesture } from 'react-native-gesture-handler';
import { declOfWord, getContrastColor, scaleHorizontal, scaleVertical } from '@/utils';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';
import { IColors } from '@/UIProvider/theme/IColors';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
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

const getChartColors = (colors: IColors) => [
    colors.evolutionChartRed,
    colors.evolutionChartGreen,
    colors.evolutionChartBlue,
    colors.evolutionChartYellow,
    colors.evolutionChartPurple,
    colors.evolutionChartBurgundy,
];

const AMATEUR_AGE_GROUPS = ['18-25', '26-35', '36-45', '46-60', '60+'];
const AMATEUR_AGE_KEYS = ['18_25', '26_35', '36_45', '46_60', '60_plus'] as const;

const EMPTY_CHART_TITLE_KEYS = ['sweetness', 'acidity', 'tannin', 'body', 'aftertaste', 'alcohol'];
const CHARACTERISTIC_NAME_ALIASES: Record<string, string[]> = {
    sweetness: ['sweetness', 'солодкість'],
    acidity: ['acidity', 'кислотність'],
    tannin: ['tannin', 'tannins', 'tanninity', 'танін', 'таніни'],
    body: ['body', 'тіло'],
    aftertaste: ['aftertaste', 'післясмак'],
    alcohol: ['alcohol', 'алкоголь'],
};
const CAROUSEL_ACTIVE_OFFSET_X = 12;
const CAROUSEL_FAIL_OFFSET_Y = 8;
const CHART_HORIZONTAL_PADDING = 8;
const CHART_VERTICAL_PADDING = 8;
const CHART_MARKER_RADIUS = 1.6;
const MIN_EVOLUTION_YEAR = 2010;
const VISIBLE_GRAPH_YEARS = 5;
const SUMMARY_GRAPH_PLOT_WIDTH = scaleHorizontal(276);
const METRIC_GRAPH_PLOT_WIDTH = scaleHorizontal(233);
const DEFAULT_CAROUSEL_HEIGHT = scaleVertical(420);
const CAROUSEL_HEIGHT_BUFFER = scaleVertical(4);

interface IConfigurablePanGesture {
    activeOffsetX: (offset: [number, number]) => IConfigurablePanGesture;
    failOffsetY: (offset: [number, number]) => IConfigurablePanGesture;
}

interface IGraphYear {
    vintage: number;
    item: IWineEvolutionVintage | null;
}

const formatScore = (value: number | null) => (value === null ? NO_DATA : value.toFixed(1));
const formatVintage = (vintage: number | null, t: ILocalization['t']) =>
    vintage === null ? t('wine.nonVintage') : `${vintage}`;

const getGraphData = (data: IWineEvolutionVintage[]) => {
    const currentYear = new Date().getFullYear();
    const usedYears = new Set<number>();

    return [...data]
        .filter(item => item.vintage !== null && item.vintage >= MIN_EVOLUTION_YEAR && item.vintage <= currentYear)
        .sort((first, second) => (second.vintage as number) - (first.vintage as number))
        .filter(item => {
            const vintage = item.vintage as number;

            if (usedYears.has(vintage)) {
                return false;
            }

            usedYears.add(vintage);

            return true;
        });
};

const getScrollablePlotWidth = (visiblePlotWidth: number, yearsCount: number) => {
    if (yearsCount <= VISIBLE_GRAPH_YEARS) {
        return visiblePlotWidth;
    }

    return (visiblePlotWidth / VISIBLE_GRAPH_YEARS) * yearsCount;
};

const getGraphTimeline = (data: IWineEvolutionVintage[]): IGraphYear[] => {
    const currentYear = new Date().getFullYear();
    const dataByYear = new Map(getGraphData(data).map(item => [item.vintage as number, item]));

    return Array.from({ length: currentYear - MIN_EVOLUTION_YEAR + 1 }, (_, index) => {
        const vintage = currentYear - index;

        return {
            vintage,
            item: dataByYear.get(vintage) ?? null,
        };
    });
};

const createEmptyRatingRows = (t: ILocalization['t']): IWineEvolutionRatingRow[] =>
    [t('wine.evolution.men'), t('wine.evolution.women')].map(label => ({
        label,
        ratings: AMATEUR_AGE_GROUPS.map(() => ({
            score: null,
            reviews: 0,
            scoreText: NO_DATA,
            reviewsText: NO_DATA,
        })),
    }));

const createEvolutionRatingRows = (item: IWineEvolutionVintage, t: ILocalization['t']): IWineEvolutionRatingRow[] => {
    return [
        {
            label: t('wine.evolution.men'),
            ratings: AMATEUR_AGE_KEYS.map(ageKey => ({
                score: item.ratingByGroup.men[ageKey].avg,
                reviews: item.ratingByGroup.men[ageKey].count,
                scoreText: formatScore(item.ratingByGroup.men[ageKey].avg),
                reviewsText:
                    item.ratingByGroup.men[ageKey].avg === null ? NO_DATA : `(${item.ratingByGroup.men[ageKey].count})`,
            })),
        },
        {
            label: t('wine.evolution.women'),
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

const createEvolutionStatistic = (
    item: IWineEvolutionStatistic,
    fallbackColor: string,
    t: ILocalization['t'],
): IWineEvolutionColorStat => ({
    label: item.name,
    reviews: item.userCount,
    reviewsText: `(${declOfWord(item.userCount, t('scanner.reviewCount') as unknown as string[])})`,
    backgroundColor: item.colorHex ?? fallbackColor,
    textColor: getContrastColor(item.colorHex ?? fallbackColor),
});

const createEvolutionCarouselCards = (
    data: IWineEvolutionVintage[],
    getStatistics: (item: IWineEvolutionVintage) => IWineEvolutionStatistic[],
    fallbackColors: string[],
    t: ILocalization['t'],
): IWineEvolutionCarouselCard[] => {
    return data.flatMap((item, index) => {
        const statistics = getStatistics(item).slice(0, 5);

        if (!statistics.length) {
            return [];
        }

        const reviewers = item.reviewers;
        const avatarUrls = (reviewers?.users ?? [])
            .map(user => user.avatar?.mediumUrl || user.avatar?.smallUrl || user.avatar?.originalUrl || '')
            .filter(Boolean)
            .slice(0, 3);
        const totalReviewers = reviewers?.totalCount ?? 0;
        const peopleCount = totalReviewers > 3 ? totalReviewers - 3 : 0;

        return [
            {
                id: `evolution-card-${item.vintage ?? 'none'}-${index}`,
                year: formatVintage(item.vintage, t),
                colors: statistics.map((statistic, statisticIndex) =>
                    createEvolutionStatistic(statistic, fallbackColors[statisticIndex % fallbackColors.length], t),
                ),
                avatarUrls,
                additionalPeople: peopleCount,
                additionalPeopleText: peopleCount ? `+${peopleCount}` : '',
            },
        ];
    });
};

const createEvolutionExpertAssessments = (
    data: IWineEvolutionVintage[],
    t: ILocalization['t'],
): IWineEvolutionExpertAssessment[] => {
    return data.flatMap((item, index) => {
        if (item.avgExpertRating === null) {
            return [];
        }

        return [
            {
                id: `expert-${item.vintage ?? 'none'}-${index}`,
                year: formatVintage(item.vintage, t),
                score: item.avgExpertRating,
            },
        ];
    });
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

        const chartWidth = Math.max(plotWidth - CHART_HORIZONTAL_PADDING * 2, 1);
        const chartHeight = Math.max(plotHeight - CHART_VERTICAL_PADDING * 2, 1);
        const x =
            CHART_HORIZONTAL_PADDING +
            (values.length > 1 ? (chartWidth / (values.length - 1)) * index : chartWidth / 2);
        const valueRange = maxValue - minValue || 1;
        const normalizedValue = Math.min(1, Math.max(0, (value - minValue) / valueRange));
        const y = plotHeight - CHART_VERTICAL_PADDING - normalizedValue * chartHeight;

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
    const markersPath = validPoints
        .map(
            point =>
                `M ${point.x - CHART_MARKER_RADIUS} ${point.y} a ${CHART_MARKER_RADIUS} ${CHART_MARKER_RADIUS} 0 1 0 ${CHART_MARKER_RADIUS * 2} 0 a ${CHART_MARKER_RADIUS} ${CHART_MARKER_RADIUS} 0 1 0 ${-CHART_MARKER_RADIUS * 2} 0`,
        )
        .join(' ');

    return {
        id,
        color,
        path: pathParts.join(' '),
        markersPath,
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
    strokeWidth: 2,
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

const normalizeCharacteristicName = (name: string) => name.trim().toLocaleLowerCase();

const getOrderedCharacteristicDefinitions = (data: IWineEvolutionVintage[], t: ILocalization['t']) => {
    const definitions = getCharacteristicDefinitions(data);

    return EMPTY_CHART_TITLE_KEYS.map(titleKey => {
        const translatedTitle = normalizeCharacteristicName(t(`wine.evolution.chartTitles.${titleKey}`));
        const aliases = [translatedTitle, ...(CHARACTERISTIC_NAME_ALIASES[titleKey] ?? [])].map(
            normalizeCharacteristicName,
        );

        return definitions.find(definition => aliases.includes(normalizeCharacteristicName(definition.name))) ?? null;
    });
};

const getCharacteristicLevels = (characteristic: IWineEvolutionTasteCharacteristic) =>
    [...characteristic.levels].sort((first, second) => second.sortNumber - first.sortNumber);

const getGridLines = (height: number) => [CHART_VERTICAL_PADDING, height / 2, height - CHART_VERTICAL_PADDING];

const getThreeYAxisLabels = (levels: IWineEvolutionTasteCharacteristic['levels']) => {
    const sortedLevels = [...levels].sort((first, second) => second.sortNumber - first.sortNumber);
    const middleIndex = Math.floor((sortedLevels.length - 1) / 2);

    return [
        sortedLevels[0]?.name ?? NO_DATA,
        sortedLevels[middleIndex]?.name ?? NO_DATA,
        sortedLevels[sortedLevels.length - 1]?.name ?? NO_DATA,
    ];
};

const createEvolutionLineCharts = (
    data: IWineEvolutionVintage[],
    chartColors: string[],
    plotWidth: number,
    t: ILocalization['t'],
): IWineEvolutionChart[] => {
    const graphTimeline = getGraphTimeline(data);
    const characteristicData = getGraphData(data);
    const compactPlotHeight = 193;
    const chartDefinitions = getOrderedCharacteristicDefinitions(characteristicData, t);

    return chartDefinitions.flatMap((characteristic, index) => {
        if (!characteristic) {
            return [];
        }

        const levels = getCharacteristicLevels(characteristic);
        const yAxisLabels = getThreeYAxisLabels(levels);
        const minValue = levels.length ? levels[levels.length - 1].sortNumber : 0;
        const maxValue = levels.length ? levels[0].sortNumber : 1;
        const chartData = graphTimeline.map(graphYear => ({
            vintage: graphYear.vintage,
            value:
                graphYear.item?.tasteCharacteristics.find(
                    itemCharacteristic => itemCharacteristic.characteristicId === characteristic.characteristicId,
                )?.avgSortNumber ?? null,
        }));

        const values = chartData.map(chartItem => chartItem.value);

        if (values.filter(value => value !== null).length < 2) {
            return [];
        }

        const chartYears = chartData.map(chartItem => `${chartItem.vintage}`);
        const chartPlotWidth = getScrollablePlotWidth(plotWidth, chartYears.length);

        return [
            createChart(
                `characteristic-${characteristic.characteristicId}`,
                characteristic.name,
                yAxisLabels,
                values,
                chartColors[index % chartColors.length],
                minValue,
                maxValue,
                chartPlotWidth,
                compactPlotHeight,
                getGridLines(compactPlotHeight),
                chartYears,
            ),
        ];
    });
};

const createEvolutionAssessmentChart = (
    data: IWineEvolutionVintage[],
    chartColors: string[],
    plotWidth: number,
    audienceVisibility: { men: boolean; women: boolean },
    onMenToggle: () => void,
    onWomenToggle: () => void,
    t: ILocalization['t'],
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

    const graphTimeline = getGraphTimeline(data);
    const visibleGroupSeries = groupSeries.filter(series => audienceVisibility[series.group]);
    const chartData = graphTimeline.map(graphYear => ({
        vintage: graphYear.vintage,
        item: graphYear.item,
    }));
    const availableYearsCount = chartData.filter(chartItem =>
        visibleGroupSeries.some(
            series => chartItem.item !== null && chartItem.item.ratingByGroup[series.group][series.ageKey].avg !== null,
        ),
    ).length;
    const chartPlotWidth = getScrollablePlotWidth(plotWidth, chartData.length);

    return {
        id: 'assessment-over-years',
        title: t('wine.evolution.assessmentOverYears'),
        yAxisLabels: ['5', '2.5', '0'],
        xAxisLabels: chartData.map(item => `${item.vintage}`),
        gridY: getGridLines(plotHeight),
        plotWidth: chartPlotWidth,
        plotHeight,
        strokeWidth: 2,
        series:
            availableYearsCount >= 2
                ? visibleGroupSeries.flatMap(series => {
                      const values = chartData.map(
                          chartItem => chartItem.item?.ratingByGroup[series.group][series.ageKey].avg ?? null,
                      );

                      return values.some(value => value !== null)
                          ? [
                                createSeries(
                                    `assessment-${series.id}`,
                                    values,
                                    chartColors[series.colorIndex % chartColors.length],
                                    0,
                                    5,
                                    chartPlotWidth,
                                    plotHeight,
                                ),
                            ]
                          : [];
                  })
                : [],
        audienceControls: [
            { id: 'men', title: t('wine.evolution.men'), isActive: audienceVisibility.men, onPress: onMenToggle },
            {
                id: 'women',
                title: t('wine.evolution.women'),
                isActive: audienceVisibility.women,
                onPress: onWomenToggle,
            },
        ],
    };
};

interface IProps {
    colors: IColors;
    locale: string;
    wineId: number;
    t: ILocalization['t'];
    onRegisterRefresh: (callback: (() => Promise<void>) | null) => void;
}

export const useWineEvolutionTab = ({ colors, locale, wineId, t, onRegisterRefresh }: IProps) => {
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

    const onConfigureCarouselPanGesture = useCallback((panGesture: PanGesture) => {
        const configurablePanGesture = panGesture as unknown as IConfigurablePanGesture;
        configurablePanGesture.activeOffsetX([-CAROUSEL_ACTIVE_OFFSET_X, CAROUSEL_ACTIVE_OFFSET_X]);
        configurablePanGesture.failOffsetY([-CAROUSEL_FAIL_OFFSET_Y, CAROUSEL_FAIL_OFFSET_Y]);
    }, []);

    const carouselItemWidth = scaleHorizontal(233);
    const chartColors = useMemo(() => getChartColors(colors), [colors]);
    const getEvolution = useCallback(async () => {
        setIsEvolutionLoading(true);
        const response = await wineService.getEvolution(wineId);

        setEvolutionData(response.isError || !response.data ? [] : response.data.filter(item => item.vintage !== null));
        setIsEvolutionLoading(false);
    }, [wineId]);

    useEffect(() => {
        const loadEvolution = async () => {
            await getEvolution();
        };

        loadEvolution();
    }, [getEvolution]);

    useEffect(() => {
        onRegisterRefresh(getEvolution);

        return () => {
            onRegisterRefresh(null);
        };
    }, [getEvolution, onRegisterRefresh]);

    const evolutionYears = useMemo(() => {
        const years = evolutionData.map(item => formatVintage(item.vintage, t));

        return years.length ? years : [NO_DATA];
    }, [evolutionData, locale, t]);

    const activeYear = evolutionYears.includes(selectedYear) ? selectedYear : evolutionYears[0];
    const activeDraftYear = evolutionYears.includes(draftYear) ? draftYear : activeYear;

    const selectedEvolution = useMemo(() => {
        return evolutionData.find(item => formatVintage(item.vintage, t) === activeYear);
    }, [activeYear, evolutionData, locale, t]);

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

    const onMenToggle = useCallback(() => {
        setAudienceVisibility(current => ({ ...current, men: !current.men }));
    }, []);

    const onWomenToggle = useCallback(() => {
        setAudienceVisibility(current => ({ ...current, women: !current.women }));
    }, []);

    const connectedLineCharts = useMemo(
        () => createEvolutionLineCharts(evolutionData, chartColors, METRIC_GRAPH_PLOT_WIDTH, t),
        [chartColors, evolutionData, locale, t],
    );

    const connectedAssessmentChart = useMemo(
        () =>
            createEvolutionAssessmentChart(
                evolutionData,
                chartColors,
                SUMMARY_GRAPH_PLOT_WIDTH,
                audienceVisibility,
                onMenToggle,
                onWomenToggle,
                t,
            ),
        [audienceVisibility, chartColors, evolutionData, locale, onMenToggle, onWomenToggle, t],
    );

    const expertAssessments = useMemo(
        () => createEvolutionExpertAssessments(evolutionData, t),
        [evolutionData, locale, t],
    );

    console.log({ evolutionData });

    const connectedColorCards = useMemo(() => {
        return createEvolutionCarouselCards(evolutionData, item => item.topColors, chartColors, t);
    }, [chartColors, evolutionData, locale, t]);

    const connectedAromaCards = useMemo(() => {
        return createEvolutionCarouselCards(evolutionData, item => item.topAromas, chartColors, t);
    }, [chartColors, evolutionData, locale, t]);

    const connectedTasteCards = useMemo(() => {
        return createEvolutionCarouselCards(
            evolutionData,
            item =>
                item.tasteCharacteristics.map(characteristic => ({
                    id: characteristic.characteristicId,
                    name: characteristic.name,
                    colorHex: characteristic.colorHex,
                    userCount: characteristic.userCount,
                })),
            chartColors,
            t,
        );
    }, [chartColors, evolutionData, locale, t]);

    const [colorCarouselHeight, setColorCarouselHeight] = useState(DEFAULT_CAROUSEL_HEIGHT);
    const [aromaCarouselHeight, setAromaCarouselHeight] = useState(DEFAULT_CAROUSEL_HEIGHT);
    const [tasteCarouselHeight, setTasteCarouselHeight] = useState(DEFAULT_CAROUSEL_HEIGHT);
    const colorCardsRef = useRef(connectedColorCards);
    const aromaCardsRef = useRef(connectedAromaCards);
    const tasteCardsRef = useRef(connectedTasteCards);
    const colorMaxHeightRef = useRef(0);
    const aromaMaxHeightRef = useRef(0);
    const tasteMaxHeightRef = useRef(0);

    const onColorCardLayout = useCallback(
        (event: LayoutChangeEvent) => {
            if (colorCardsRef.current !== connectedColorCards) {
                colorCardsRef.current = connectedColorCards;
                colorMaxHeightRef.current = 0;
            }

            const nextHeight = Math.ceil(event.nativeEvent.layout.height + CAROUSEL_HEIGHT_BUFFER);

            if (nextHeight <= colorMaxHeightRef.current) {
                return;
            }

            colorMaxHeightRef.current = nextHeight;
            setColorCarouselHeight(nextHeight);
        },
        [connectedColorCards],
    );

    const onAromaCardLayout = useCallback(
        (event: LayoutChangeEvent) => {
            if (aromaCardsRef.current !== connectedAromaCards) {
                aromaCardsRef.current = connectedAromaCards;
                aromaMaxHeightRef.current = 0;
            }

            const nextHeight = Math.ceil(event.nativeEvent.layout.height + CAROUSEL_HEIGHT_BUFFER);

            if (nextHeight <= aromaMaxHeightRef.current) {
                return;
            }

            aromaMaxHeightRef.current = nextHeight;
            setAromaCarouselHeight(nextHeight);
        },
        [connectedAromaCards],
    );

    const onTasteCardLayout = useCallback(
        (event: LayoutChangeEvent) => {
            if (tasteCardsRef.current !== connectedTasteCards) {
                tasteCardsRef.current = connectedTasteCards;
                tasteMaxHeightRef.current = 0;
            }

            const nextHeight = Math.ceil(event.nativeEvent.layout.height + CAROUSEL_HEIGHT_BUFFER);

            if (nextHeight <= tasteMaxHeightRef.current) {
                return;
            }

            tasteMaxHeightRef.current = nextHeight;
            setTasteCarouselHeight(nextHeight);
        },
        [connectedTasteCards],
    );

    const getCarouselIndex = useCallback((itemsCount: number, absoluteProgress: number) => {
        const maxIndex = Math.max(0, itemsCount - 1);

        return Math.max(0, Math.min(maxIndex, Math.round(absoluteProgress)));
    }, []);

    const onExpertProgressChange = useCallback(
        (_offsetProgress: number, absoluteProgress: number) => {
            const nextIndex = getCarouselIndex(expertAssessments.length, absoluteProgress);

            setExpertActiveIndex(currentIndex => (currentIndex === nextIndex ? currentIndex : nextIndex));
        },
        [expertAssessments.length, getCarouselIndex],
    );

    const onColorProgressChange = useCallback(
        (_offsetProgress: number, absoluteProgress: number) => {
            const nextIndex = getCarouselIndex(connectedColorCards.length, absoluteProgress);

            setColorActiveIndex(currentIndex => (currentIndex === nextIndex ? currentIndex : nextIndex));
        },
        [connectedColorCards.length, getCarouselIndex],
    );

    const onAromaProgressChange = useCallback(
        (_offsetProgress: number, absoluteProgress: number) => {
            const nextIndex = getCarouselIndex(connectedAromaCards.length, absoluteProgress);

            setAromaActiveIndex(currentIndex => (currentIndex === nextIndex ? currentIndex : nextIndex));
        },
        [connectedAromaCards.length, getCarouselIndex],
    );

    const onTasteProgressChange = useCallback(
        (_offsetProgress: number, absoluteProgress: number) => {
            const nextIndex = getCarouselIndex(connectedTasteCards.length, absoluteProgress);

            setTasteActiveIndex(currentIndex => (currentIndex === nextIndex ? currentIndex : nextIndex));
        },
        [connectedTasteCards.length, getCarouselIndex],
    );

    const safeExpertActiveIndex = Math.min(expertActiveIndex, Math.max(expertAssessments.length - 1, 0));
    const safeColorActiveIndex = Math.min(colorActiveIndex, Math.max(connectedColorCards.length - 1, 0));
    const safeAromaActiveIndex = Math.min(aromaActiveIndex, Math.max(connectedAromaCards.length - 1, 0));
    const safeTasteActiveIndex = Math.min(tasteActiveIndex, Math.max(connectedTasteCards.length - 1, 0));

    const amateurRatingRows = useMemo(
        () => (selectedEvolution ? createEvolutionRatingRows(selectedEvolution, t) : createEmptyRatingRows(t)),
        [locale, selectedEvolution, t],
    );
    const proAssessmentScore = selectedEvolution?.avgExpertRating ?? null;
    const selectedWinePeak = selectedEvolution?.winePeaks[0];
    const winePeakYear = selectedWinePeak ? `${selectedWinePeak.year}` : NO_DATA;
    const winePeakReviews = selectedWinePeak
        ? `(${declOfWord(selectedWinePeak.userCount, t('scanner.reviewCount') as unknown as string[])})`
        : NO_DATA;

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
        onExpertProgressChange,
        onConfigureCarouselPanGesture,
        colorCarouselHeight,
        onColorCardLayout,
        colorCards: connectedColorCards,
        colorActiveIndex: safeColorActiveIndex,
        colorCarouselRef,
        onColorProgressChange,
        aromaCards: connectedAromaCards,
        aromaActiveIndex: safeAromaActiveIndex,
        aromaCarouselRef,
        aromaCarouselHeight,
        onAromaCardLayout,
        onAromaProgressChange,
        tasteCards: connectedTasteCards,
        tasteActiveIndex: safeTasteActiveIndex,
        tasteCarouselRef,
        tasteCarouselHeight,
        onTasteCardLayout,
        onTasteProgressChange,
        amateurAgeGroups: AMATEUR_AGE_GROUPS,
        amateurRatingRows,
        assessmentChart: connectedAssessmentChart,
        lineCharts: connectedLineCharts,
        carouselItemWidth,
        onYearPress,
        onYearPickerClose,
        onYearConfirm,
        onColorPrevious,
        onColorNext,
        onAromaPrevious,
        onAromaNext,
        onTastePrevious,
        onTasteNext,
    };
};
