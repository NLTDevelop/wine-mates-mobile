import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import type { PanGesture } from 'react-native-gesture-handler';
import { declOfWord, getContrastColor, scaleHorizontal, scaleVertical } from '@/utils';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';
import { IColors } from '@/UIProvider/theme/IColors';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { wineService } from '@/entities/wine/services/WineService';
import {
    IWineEvolutionAggregate,
    IWineEvolutionDetailsResponse,
    IWineEvolutionStatistic,
    IWineEvolutionTasteCharacteristic,
    IWineEvolutionYear,
    IWineEvolutionYearsResponse,
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
const ALL_YEARS_VALUE = 'all';
const VISIBLE_GRAPH_YEARS = 5;
const CHART_HORIZONTAL_PADDING = 8;
const CHART_VERTICAL_PADDING = 8;
const CHART_MARKER_RADIUS = 4;
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
const METRIC_GRAPH_PLOT_WIDTH = scaleHorizontal(233);
const SUMMARY_GRAPH_PLOT_WIDTH = scaleHorizontal(276);
const DEFAULT_CAROUSEL_HEIGHT = scaleVertical(420);
const CAROUSEL_HEIGHT_BUFFER = scaleVertical(4);

interface IConfigurablePanGesture {
    activeOffsetX: (offset: [number, number]) => IConfigurablePanGesture;
    failOffsetY: (offset: [number, number]) => IConfigurablePanGesture;
}

const getChartColors = (colors: IColors) => [
    colors.evolutionChartRed,
    colors.evolutionChartGreen,
    colors.evolutionChartBlue,
    colors.evolutionChartYellow,
    colors.evolutionChartPurple,
    colors.evolutionChartBurgundy,
];

const formatScore = (value: number | null) => (value === null ? NO_DATA : value.toFixed(1));

const getSortedYears = (years: IWineEvolutionYear[]) =>
    (Array.isArray(years) ? [...years] : []).sort((first, second) => second.year - first.year);

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

const getGroupAverage = (group: { avg: number | null; count: number }) => (group.count > 0 ? group.avg : null);

const isWinePeakAvailable = (
    peak: IWineEvolutionYear['winePeak'],
): peak is NonNullable<IWineEvolutionYear['winePeak']> =>
    peak !== null && peak !== undefined && peak.from !== null && peak.to !== null;

const createEvolutionRatingRows = (
    item: IWineEvolutionYear | IWineEvolutionAggregate,
    t: ILocalization['t'],
): IWineEvolutionRatingRow[] => [
    {
        label: t('wine.evolution.men'),
        ratings: AMATEUR_AGE_KEYS.map(ageKey => ({
            score: getGroupAverage(item.ratingByGroup.men[ageKey]),
            reviews: item.ratingByGroup.men[ageKey].count,
            scoreText: formatScore(getGroupAverage(item.ratingByGroup.men[ageKey])),
            reviewsText:
                getGroupAverage(item.ratingByGroup.men[ageKey]) === null
                    ? NO_DATA
                    : `(${item.ratingByGroup.men[ageKey].count})`,
        })),
    },
    {
        label: t('wine.evolution.women'),
        ratings: AMATEUR_AGE_KEYS.map(ageKey => ({
            score: getGroupAverage(item.ratingByGroup.women[ageKey]),
            reviews: item.ratingByGroup.women[ageKey].count,
            scoreText: formatScore(getGroupAverage(item.ratingByGroup.women[ageKey])),
            reviewsText:
                getGroupAverage(item.ratingByGroup.women[ageKey]) === null
                    ? NO_DATA
                    : `(${item.ratingByGroup.women[ageKey].count})`,
        })),
    },
];

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

const createAggregateCarouselCards = (
    id: string,
    title: string,
    statistics: IWineEvolutionStatistic[],
    reviewers: IWineEvolutionAggregate['reviewers'],
    fallbackColors: string[],
    t: ILocalization['t'],
): IWineEvolutionCarouselCard[] => {
    const visibleStatistics = (Array.isArray(statistics) ? statistics : []).slice(0, 5);

    if (!visibleStatistics.length) {
        return [];
    }

    const avatarUrls = (reviewers?.users ?? [])
        .map(user => user.avatar?.mediumUrl || user.avatar?.smallUrl || user.avatar?.originalUrl || '')
        .filter(Boolean)
        .slice(0, 3);
    const totalReviewers = reviewers?.totalCount ?? 0;
    const additionalPeople = totalReviewers > 3 ? totalReviewers - 3 : 0;

    return [
        {
            id,
            year: title,
            colors: visibleStatistics.map((statistic, index) =>
                createEvolutionStatistic(statistic, fallbackColors[index % fallbackColors.length], t),
            ),
            avatarUrls,
            additionalPeople,
            additionalPeopleText: additionalPeople ? `+${additionalPeople}` : '',
        },
    ];
};

const createEvolutionExpertAssessments = (data: IWineEvolutionYear[]): IWineEvolutionExpertAssessment[] =>
    getSortedYears(data)
        .filter(item => item.reviewCount > 0)
        .map(item => ({
            id: `tasting-${item.year}`,
            year: `${item.year}`,
            proScore: item.avgExpertRating,
            userScore: item.avgUserRating,
            userScoreText: formatScore(item.avgUserRating),
        }));

const createSeries = (
    id: string,
    values: Array<number | null>,
    color: string,
    minValue: number,
    maxValue: number,
    plotWidth: number,
    plotHeight: number,
    valueTexts?: Array<string | null>,
): IWineEvolutionLineSeries => {
    const chartWidth = Math.max(plotWidth - CHART_HORIZONTAL_PADDING * 2, 1);
    const chartHeight = Math.max(plotHeight - CHART_VERTICAL_PADDING * 2, 1);
    const valueRange = maxValue - minValue || 1;
    const points = values.map((value, index) => {
        if (value === null) {
            return null;
        }

        const x =
            CHART_HORIZONTAL_PADDING +
            (values.length > 1 ? (chartWidth / (values.length - 1)) * index : chartWidth / 2);
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

    const validPoints = points
        .map((point, index) => (point ? { ...point, index } : null))
        .filter((point): point is { index: number; x: number; y: number } => point !== null);
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
        points: validPoints.map(point => {
            const value = values[point.index] as number;

            return {
                ...point,
                value,
                valueText: valueTexts?.[point.index] ?? formatScore(value),
            };
        }),
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
    xAxisLabels: string[],
    valueTexts?: Array<string | null>,
    audienceControls?: IWineEvolutionChart['audienceControls'],
): IWineEvolutionChart => ({
    id,
    title,
    yAxisLabels,
    xAxisLabels,
    gridY: [CHART_VERTICAL_PADDING, plotHeight / 2, plotHeight - CHART_VERTICAL_PADDING],
    plotWidth,
    plotHeight,
    strokeWidth: 2,
    series: values.some(value => value !== null)
        ? [createSeries(id, values, color, minValue, maxValue, plotWidth, plotHeight, valueTexts)]
        : [],
    audienceControls,
});

const getScrollablePlotWidth = (visiblePlotWidth: number, yearsCount: number) =>
    yearsCount <= VISIBLE_GRAPH_YEARS ? visiblePlotWidth : (visiblePlotWidth / VISIBLE_GRAPH_YEARS) * yearsCount;

const getChartYears = (years: number[], fallbackYears: number[] = []) => {
    const sourceYears = years.length ? years : fallbackYears;

    return [...new Set(sourceYears.filter(year => Number.isFinite(year)))].sort((first, second) => second - first);
};

const getThreeYAxisLabels = (levels: IWineEvolutionTasteCharacteristic['levels']) => {
    const sortedLevels = [...levels].sort((first, second) => second.sortNumber - first.sortNumber);
    const middleIndex = Math.floor((sortedLevels.length - 1) / 2);

    return [
        sortedLevels[0]?.name ?? NO_DATA,
        sortedLevels[middleIndex]?.name ?? NO_DATA,
        sortedLevels[sortedLevels.length - 1]?.name ?? NO_DATA,
    ];
};

const getNormalizedTasteValue = (
    levels: IWineEvolutionTasteCharacteristic['levels'],
    value: { avgLevelId: number | null; avgSortNumber: number | null } | null | undefined,
) => {
    const sortedLevels = [...levels].sort((first, second) => second.sortNumber - first.sortNumber);
    const levelIndex = sortedLevels.findIndex(level => level.id === value?.avgLevelId);

    if (levelIndex >= 0) {
        return sortedLevels.length > 1 ? 1 - levelIndex / (sortedLevels.length - 1) : 0.5;
    }

    if (value?.avgSortNumber === null || value?.avgSortNumber === undefined || !sortedLevels.length) {
        return null;
    }

    const min = sortedLevels[sortedLevels.length - 1].sortNumber;
    const max = sortedLevels[0].sortNumber;
    const range = max - min;

    return range === 0 ? 0.5 : Math.min(1, Math.max(0, (value.avgSortNumber - min) / range));
};

const getTasteValueText = (
    levels: IWineEvolutionTasteCharacteristic['levels'],
    value: { avgLevelId: number | null; avgSortNumber: number | null; levelName?: string | null } | null | undefined,
) => {
    if (value?.levelName) {
        return value.levelName;
    }

    const selectedLevel = levels.find(level => level.id === value?.avgLevelId);
    if (selectedLevel) {
        return selectedLevel.name;
    }

    if (value?.avgSortNumber === null || value?.avgSortNumber === undefined) {
        return NO_DATA;
    }

    return (
        [...levels].sort(
            (first, second) =>
                Math.abs(first.sortNumber - value.avgSortNumber!) - Math.abs(second.sortNumber - value.avgSortNumber!),
        )[0]?.name ?? NO_DATA
    );
};

const normalizeCharacteristicName = (name: string) => name.trim().toLocaleLowerCase();

const createEvolutionLineCharts = (
    characteristics: IWineEvolutionTasteCharacteristic[],
    years: number[],
    chartColors: string[],
    plotWidth: number,
    allYearsTitle: string,
    t: ILocalization['t'],
): IWineEvolutionChart[] => {
    const availableCharacteristics = Array.isArray(characteristics) ? characteristics : [];
    const definitions = EMPTY_CHART_TITLE_KEYS.map(titleKey => {
        const translatedTitle = normalizeCharacteristicName(t(`wine.evolution.chartTitles.${titleKey}`));
        const aliases = [translatedTitle, ...(CHARACTERISTIC_NAME_ALIASES[titleKey] ?? [])].map(
            normalizeCharacteristicName,
        );

        return (
            availableCharacteristics.find(characteristic =>
                aliases.includes(normalizeCharacteristicName(characteristic.name)),
            ) ?? null
        );
    });

    return definitions.flatMap((characteristic, index) => {
        if (!characteristic) {
            return [];
        }

        const valuesByYear = new Map(
            (characteristic.byYear ?? [])
                .filter(value => value.year !== undefined)
                .map(value => [value.year as number, value]),
        );
        const chartYears = valuesByYear.size ? getChartYears(years, [...valuesByYear.keys()]) : [];
        const yearValues = chartYears.map(year => valuesByYear.get(year));
        const values = yearValues.map(value => getNormalizedTasteValue(characteristic.levels, value));
        const aggregateValue = characteristic.allYears ?? {
            avgLevelId: characteristic.avgLevelId ?? null,
            avgSortNumber: characteristic.avgSortNumber ?? null,
            levelName: characteristic.levelName ?? null,
        };
        const hasYearValues = values.some(value => value !== null);
        const aggregateChartValue = getNormalizedTasteValue(characteristic.levels, aggregateValue);
        const chartValues = hasYearValues ? values : aggregateChartValue === null ? [] : [aggregateChartValue];
        const chartValueTexts = hasYearValues
            ? yearValues.map(value => getTasteValueText(characteristic.levels, value))
            : [getTasteValueText(characteristic.levels, aggregateValue)];
        const xAxisLabels = hasYearValues ? chartYears.map(year => `${year}`) : [allYearsTitle];

        if (!chartValues.some(value => value !== null)) {
            return [];
        }

        const chartPlotWidth = getScrollablePlotWidth(plotWidth, xAxisLabels.length);

        return [
            createChart(
                `characteristic-${characteristic.characteristicId}`,
                characteristic.name,
                getThreeYAxisLabels(characteristic.levels),
                chartValues,
                characteristic.colorHex ?? chartColors[index % chartColors.length],
                0,
                1,
                chartPlotWidth,
                scaleVertical(193),
                xAxisLabels,
                chartValueTexts,
            ),
        ];
    });
};

const createEvolutionAssessmentChart = (
    data: IWineEvolutionYear[],
    years: number[],
    fallbackYear: number,
    chartColors: string[],
    plotWidth: number,
    audienceVisibility: { men: boolean; women: boolean },
    onMenToggle: () => void,
    onWomenToggle: () => void,
    t: ILocalization['t'],
): IWineEvolutionChart => {
    const groupSeries = [
        ...AMATEUR_AGE_KEYS.map((ageKey, index) => ({ id: `men-${ageKey}`, group: 'men' as const, ageKey, index })),
        ...AMATEUR_AGE_KEYS.map((ageKey, index) => ({ id: `women-${ageKey}`, group: 'women' as const, ageKey, index })),
    ];
    const availableChartYears = getChartYears(
        years,
        getSortedYears(data).map(item => item.year),
    );
    const chartYears = availableChartYears.length ? availableChartYears : [fallbackYear];
    const dataByYear = new Map(getSortedYears(data).map(item => [item.year, item]));
    const chartPlotWidth = getScrollablePlotWidth(plotWidth, chartYears.length);
    const visibleSeries = groupSeries.filter(series => audienceVisibility[series.group]);
    const series = visibleSeries.flatMap(item => {
        const values = chartYears.map(year => {
            const yearData = dataByYear.get(year);

            return yearData ? getGroupAverage(yearData.ratingByGroup[item.group][item.ageKey]) : null;
        });

        return values.some(value => value !== null)
            ? [
                  createSeries(
                      `assessment-${item.id}`,
                      values,
                      chartColors[item.index % chartColors.length],
                      0,
                      5,
                      chartPlotWidth,
                      scaleVertical(282),
                  ),
              ]
            : [];
    });

    return {
        id: 'assessment-over-years',
        title: t('wine.evolution.assessmentOverYears'),
        yAxisLabels: ['5', '2.5', '0'],
        xAxisLabels: chartYears.map(year => `${year}`),
        gridY: [CHART_VERTICAL_PADDING, scaleVertical(282) / 2, scaleVertical(282) - CHART_VERTICAL_PADDING],
        plotWidth: chartPlotWidth,
        plotHeight: scaleVertical(282),
        strokeWidth: 2,
        series,
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
    wineId: number;
    t: ILocalization['t'];
    onRegisterRefresh: (callback: (() => Promise<void>) | null) => void;
}

export const useWineEvolutionTab = ({ colors, wineId, t, onRegisterRefresh }: IProps) => {
    const [timelineData, setTimelineData] = useState<IWineEvolutionYearsResponse | null>(null);
    const [selectedEvolution, setSelectedEvolution] = useState<IWineEvolutionDetailsResponse | null>(null);
    const [isEvolutionLoading, setIsEvolutionLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(ALL_YEARS_VALUE);
    const [draftYear, setDraftYear] = useState(ALL_YEARS_VALUE);
    const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);
    const [expertActiveIndex, setExpertActiveIndex] = useState(0);
    const [colorActiveIndex, setColorActiveIndex] = useState(0);
    const [aromaActiveIndex, setAromaActiveIndex] = useState(0);
    const [tasteActiveIndex, setTasteActiveIndex] = useState(0);
    const [audienceVisibility, setAudienceVisibility] = useState({ men: true, women: true });
    const colorCarouselRef = useRef<ICarouselInstance>(null);
    const aromaCarouselRef = useRef<ICarouselInstance>(null);
    const tasteCarouselRef = useRef<ICarouselInstance>(null);
    const selectedRequestIdRef = useRef(0);
    const selectedYearRef = useRef(ALL_YEARS_VALUE);
    const chartColors = useMemo(() => getChartColors(colors), [colors]);
    const carouselItemWidth = scaleHorizontal(259);

    const onConfigureCarouselPanGesture = useCallback((panGesture: PanGesture) => {
        const configurablePanGesture = panGesture as unknown as IConfigurablePanGesture;
        configurablePanGesture.activeOffsetX([-CAROUSEL_ACTIVE_OFFSET_X, CAROUSEL_ACTIVE_OFFSET_X]);
        configurablePanGesture.failOffsetY([-CAROUSEL_FAIL_OFFSET_Y, CAROUSEL_FAIL_OFFSET_Y]);
    }, []);

    const loadTimeline = useCallback(async () => {
        const response = await wineService.getEvolutionYears(wineId);

        if (!response.isError && response.data) {
            setTimelineData(response.data);
        }
    }, [wineId]);

    const loadSelectedEvolution = useCallback(
        async (year: string) => {
            selectedRequestIdRef.current += 1;
            const requestId = selectedRequestIdRef.current;
            const numericYear = year === ALL_YEARS_VALUE ? undefined : Number(year);
            const response = await wineService.getEvolution(wineId, numericYear);

            if (requestId === selectedRequestIdRef.current && !response.isError && response.data) {
                setSelectedEvolution(response.data);
                return true;
            }

            return false;
        },
        [wineId],
    );

    const refreshEvolution = useCallback(async () => {
        setIsEvolutionLoading(true);

        try {
            await Promise.all([loadTimeline(), loadSelectedEvolution(selectedYearRef.current)]);
        } finally {
            setIsEvolutionLoading(false);
        }
    }, [loadSelectedEvolution, loadTimeline]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            refreshEvolution();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [refreshEvolution]);

    useEffect(() => {
        onRegisterRefresh(refreshEvolution);

        return () => onRegisterRefresh(null);
    }, [onRegisterRefresh, refreshEvolution]);

    const allYearsTitle = t('wine.evolution.allYears');
    const tastingYears = useMemo(() => {
        const apiYears = (timelineData?.years ?? []).filter(year => Number.isFinite(year));

        return [...new Set(apiYears)].sort((first, second) => second - first).map(year => `${year}`);
    }, [timelineData?.years]);
    const yearValues = useMemo(() => [ALL_YEARS_VALUE, ...tastingYears], [tastingYears]);
    const activeYear = yearValues.includes(selectedYear) ? selectedYear : ALL_YEARS_VALUE;
    const activeDraftYear = yearValues.includes(draftYear) ? draftYear : activeYear;

    const onYearPress = useCallback(() => {
        setDraftYear(activeYear);
        setIsYearPickerVisible(true);
    }, [activeYear]);
    const onYearPickerClose = useCallback(() => setIsYearPickerVisible(false), []);
    const onYearSelect = useCallback((year: string) => () => setDraftYear(year), []);
    const yearOptions = useMemo<IUniversalPickerOption[]>(
        () =>
            yearValues.map(year => ({
                id: year,
                title: year === ALL_YEARS_VALUE ? allYearsTitle : year,
                isSelected: activeDraftYear === year,
                onPress: onYearSelect(year),
            })),
        [activeDraftYear, allYearsTitle, onYearSelect, yearValues],
    );
    const onYearConfirm = useCallback(async () => {
        setIsYearPickerVisible(false);
        setIsEvolutionLoading(true);

        try {
            const isLoaded = await loadSelectedEvolution(activeDraftYear);

            if (isLoaded) {
                selectedYearRef.current = activeDraftYear;
                setSelectedYear(activeDraftYear);
            }
        } finally {
            setIsEvolutionLoading(false);
        }
    }, [activeDraftYear, loadSelectedEvolution]);

    const onMenToggle = useCallback(() => setAudienceVisibility(current => ({ ...current, men: !current.men })), []);
    const onWomenToggle = useCallback(
        () => setAudienceVisibility(current => ({ ...current, women: !current.women })),
        [],
    );

    const expertAssessments = useMemo(
        () => createEvolutionExpertAssessments(timelineData?.charts.ratings ?? []),
        [timelineData?.charts.ratings],
    );
    const selectedYearTitle = activeYear === ALL_YEARS_VALUE ? allYearsTitle : activeYear;
    const connectedColorCards = useMemo(
        () =>
            createAggregateCarouselCards(
                `colors-${activeYear}`,
                selectedYearTitle,
                selectedEvolution?.topColors ?? [],
                selectedEvolution?.reviewers ?? null,
                chartColors,
                t,
            ),
        [activeYear, chartColors, selectedEvolution?.reviewers, selectedEvolution?.topColors, selectedYearTitle, t],
    );
    const connectedAromaCards = useMemo(
        () =>
            createAggregateCarouselCards(
                `aromas-${activeYear}`,
                selectedYearTitle,
                selectedEvolution?.topAromas ?? [],
                selectedEvolution?.reviewers ?? null,
                chartColors,
                t,
            ),
        [activeYear, chartColors, selectedEvolution?.reviewers, selectedEvolution?.topAromas, selectedYearTitle, t],
    );
    const connectedTasteCards = useMemo(
        () =>
            createAggregateCarouselCards(
                `tastes-${activeYear}`,
                selectedYearTitle,
                selectedEvolution?.topFlavors ?? [],
                selectedEvolution?.reviewers ?? null,
                chartColors,
                t,
            ),
        [activeYear, chartColors, selectedEvolution?.reviewers, selectedEvolution?.topFlavors, selectedYearTitle, t],
    );
    const connectedLineCharts = useMemo(
        () =>
            createEvolutionLineCharts(
                timelineData?.charts.tasteCharacteristics ?? [],
                timelineData?.years ?? [],
                chartColors,
                METRIC_GRAPH_PLOT_WIDTH,
                allYearsTitle,
                t,
            ),
        [allYearsTitle, chartColors, timelineData?.charts.tasteCharacteristics, timelineData?.years, t],
    );
    const connectedAssessmentChart = useMemo(
        () =>
            createEvolutionAssessmentChart(
                timelineData?.charts.ratings ?? [],
                timelineData?.years ?? [],
                timelineData?.currentYear ?? new Date().getFullYear(),
                chartColors,
                SUMMARY_GRAPH_PLOT_WIDTH,
                audienceVisibility,
                onMenToggle,
                onWomenToggle,
                t,
            ),
        [
            audienceVisibility,
            chartColors,
            timelineData?.charts.ratings,
            timelineData?.currentYear,
            timelineData?.years,
            onMenToggle,
            onWomenToggle,
            t,
        ],
    );

    const [colorCarouselHeight, setColorCarouselHeight] = useState(DEFAULT_CAROUSEL_HEIGHT);
    const [aromaCarouselHeight, setAromaCarouselHeight] = useState(DEFAULT_CAROUSEL_HEIGHT);
    const [tasteCarouselHeight, setTasteCarouselHeight] = useState(DEFAULT_CAROUSEL_HEIGHT);
    const onColorCardLayout = useCallback((event: LayoutChangeEvent) => {
        const height = event?.nativeEvent?.layout?.height;

        if (!height) {
            return;
        }

        setColorCarouselHeight(Math.ceil(height + CAROUSEL_HEIGHT_BUFFER));
    }, []);
    const onAromaCardLayout = useCallback((event: LayoutChangeEvent) => {
        const height = event?.nativeEvent?.layout?.height;

        if (!height) {
            return;
        }

        setAromaCarouselHeight(Math.ceil(height + CAROUSEL_HEIGHT_BUFFER));
    }, []);
    const onTasteCardLayout = useCallback((event: LayoutChangeEvent) => {
        const height = event?.nativeEvent?.layout?.height;

        if (!height) {
            return;
        }

        setTasteCarouselHeight(Math.ceil(height + CAROUSEL_HEIGHT_BUFFER));
    }, []);

    const getCarouselIndex = useCallback((itemsCount: number, absoluteProgress: number) => {
        return Math.max(0, Math.min(Math.max(itemsCount - 1, 0), Math.round(absoluteProgress)));
    }, []);
    const onExpertScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
            const maxOffset = Math.max(contentSize.width - layoutMeasurement.width, 0);
            const scrollProgress = maxOffset > 0 ? Math.min(1, Math.max(0, contentOffset.x / maxOffset)) : 0;
            const nextIndex = Math.round(scrollProgress * Math.max(expertAssessments.length - 1, 0));

            setExpertActiveIndex(nextIndex);
        },
        [expertAssessments.length],
    );
    const onColorProgressChange = useCallback(
        (_: number, absoluteProgress: number) => {
            setColorActiveIndex(getCarouselIndex(connectedColorCards.length, absoluteProgress));
        },
        [connectedColorCards.length, getCarouselIndex],
    );
    const onAromaProgressChange = useCallback(
        (_: number, absoluteProgress: number) => {
            setAromaActiveIndex(getCarouselIndex(connectedAromaCards.length, absoluteProgress));
        },
        [connectedAromaCards.length, getCarouselIndex],
    );
    const onTasteProgressChange = useCallback(
        (_: number, absoluteProgress: number) => {
            setTasteActiveIndex(getCarouselIndex(connectedTasteCards.length, absoluteProgress));
        },
        [connectedTasteCards.length, getCarouselIndex],
    );

    const amateurRatingRows = useMemo(
        () => (selectedEvolution ? createEvolutionRatingRows(selectedEvolution, t) : createEmptyRatingRows(t)),
        [selectedEvolution, t],
    );
    const hasSelectedYearData = Boolean(selectedEvolution && selectedEvolution.reviewCount > 0);
    const proAssessmentScore = hasSelectedYearData ? (selectedEvolution?.avgExpertRating ?? null) : null;
    const wineLoverScore = hasSelectedYearData ? (selectedEvolution?.avgUserRating ?? null) : null;
    const wineLoverScoreText = formatScore(wineLoverScore);
    const selectedWinePeak = isWinePeakAvailable(selectedEvolution?.winePeak ?? null)
        ? selectedEvolution?.winePeak
        : null;
    const winePeakYear = selectedWinePeak
        ? selectedWinePeak.from === selectedWinePeak.to
            ? `${selectedWinePeak.from}`
            : `${selectedWinePeak.from}-${selectedWinePeak.to}`
        : NO_DATA;
    const winePeakReviewCount = selectedWinePeak
        ? selectedWinePeak.distribution.reduce((total, item) => total + item.userCount, 0)
        : 0;
    const winePeakReviews = selectedWinePeak
        ? `(${declOfWord(winePeakReviewCount, t('scanner.reviewCount') as unknown as string[])})`
        : NO_DATA;

    return {
        tastingYear: activeYear === ALL_YEARS_VALUE ? allYearsTitle : activeYear,
        proAssessmentScore,
        wineLoverScoreText,
        hasProAssessment: proAssessmentScore !== null,
        hasWineLoverScore: wineLoverScore !== null,
        winePeakYear,
        winePeakReviews,
        hasWinePeak: selectedWinePeak !== null,
        isInitialLoading: isEvolutionLoading && selectedEvolution === null,
        isYearPickerVisible,
        yearOptions,
        expertAssessments,
        expertActiveIndex: Math.min(expertActiveIndex, Math.max(expertAssessments.length - 1, 0)),
        onExpertScroll,
        onConfigureCarouselPanGesture,
        colorCarouselHeight,
        onColorCardLayout,
        colorCards: connectedColorCards,
        colorActiveIndex: Math.min(colorActiveIndex, Math.max(connectedColorCards.length - 1, 0)),
        colorCarouselRef,
        onColorProgressChange,
        aromaCards: connectedAromaCards,
        aromaActiveIndex: Math.min(aromaActiveIndex, Math.max(connectedAromaCards.length - 1, 0)),
        aromaCarouselRef,
        aromaCarouselHeight,
        onAromaCardLayout,
        onAromaProgressChange,
        tasteCards: connectedTasteCards,
        tasteActiveIndex: Math.min(tasteActiveIndex, Math.max(connectedTasteCards.length - 1, 0)),
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
    };
};
