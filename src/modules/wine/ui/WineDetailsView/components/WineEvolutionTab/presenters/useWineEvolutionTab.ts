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
    IWineEvolutionAggregate,
    IWineEvolutionResponse,
    IWineEvolutionRatingByGroup,
    IWineEvolutionStatistic,
    IWineEvolutionTasteCharacteristic,
    IWineEvolutionWinePeakDistribution,
    IWineEvolutionYear,
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

const getTastingYears = (currentYear: number, additionalYears: number[] = []) => {
    const years = new Set([currentYear, ...additionalYears].filter(year => Number.isFinite(year)));

    return [...years].sort((first, second) => second - first).map(year => `${year}`);
};

const createEmptyRatingByGroup = (): IWineEvolutionRatingByGroup => ({
    men: {
        '18_25': { avg: null, count: 0 },
        '26_35': { avg: null, count: 0 },
        '36_45': { avg: null, count: 0 },
        '46_60': { avg: null, count: 0 },
        '60_plus': { avg: null, count: 0 },
    },
    women: {
        '18_25': { avg: null, count: 0 },
        '26_35': { avg: null, count: 0 },
        '36_45': { avg: null, count: 0 },
        '46_60': { avg: null, count: 0 },
        '60_plus': { avg: null, count: 0 },
    },
});

const createWinePeakFromDistribution = (distribution: IWineEvolutionWinePeakDistribution[] | undefined) => {
    const availableDistribution = Array.isArray(distribution) ? distribution : [];

    if (!availableDistribution.length) {
        return null;
    }

    const years = availableDistribution.map(item => item.year);

    return {
        from: Math.min(...years),
        to: Math.max(...years),
        distribution: availableDistribution,
    };
};

const getWeightedAverage = (items: IWineEvolutionYear[], getValue: (item: IWineEvolutionYear) => number | null) => {
    const totalReviews = items.reduce((total, item) => total + item.reviewCount, 0);
    const weightedTotal = items.reduce((total, item) => {
        const value = getValue(item);

        return value === null ? total : total + value * item.reviewCount;
    }, 0);

    return totalReviews > 0 ? weightedTotal / totalReviews : null;
};

const createAggregateFromYears = (years: IWineEvolutionYear[]): IWineEvolutionAggregate => {
    const createGroup = (group: 'men' | 'women', ageKey: (typeof AMATEUR_AGE_KEYS)[number]) => {
        const count = years.reduce((total, item) => total + item.ratingByGroup[group][ageKey].count, 0);
        const weightedTotal = years.reduce((total, item) => {
            const rating = item.ratingByGroup[group][ageKey];

            return rating.avg === null ? total : total + rating.avg * rating.count;
        }, 0);

        return {
            avg: count > 0 ? weightedTotal / count : null,
            count,
        };
    };

    const distribution = years.flatMap(item => item.winePeak?.distribution ?? []);

    return {
        reviewCount: years.reduce((total, item) => total + item.reviewCount, 0),
        avgUserRating: getWeightedAverage(years, item => item.avgUserRating),
        avgExpertRating: getWeightedAverage(years, item => item.avgExpertRating),
        ratingByGroup: {
            men: {
                '18_25': createGroup('men', '18_25'),
                '26_35': createGroup('men', '26_35'),
                '36_45': createGroup('men', '36_45'),
                '46_60': createGroup('men', '46_60'),
                '60_plus': createGroup('men', '60_plus'),
            },
            women: {
                '18_25': createGroup('women', '18_25'),
                '26_35': createGroup('women', '26_35'),
                '36_45': createGroup('women', '36_45'),
                '46_60': createGroup('women', '46_60'),
                '60_plus': createGroup('women', '60_plus'),
            },
        },
        winePeak: createWinePeakFromDistribution(distribution),
        reviewers: null,
    };
};

const normalizeEvolutionResponse = (
    data: IWineEvolutionResponse | IWineEvolutionYear[],
    wineId: number,
): IWineEvolutionResponse => {
    if (Array.isArray(data)) {
        const years = getSortedYears(data);

        return {
            wineId,
            vintage: null,
            currentYear: years[0]?.year ?? new Date().getFullYear(),
            years: years.map(item => item.year),
            byYear: years,
            allYears: createAggregateFromYears(years),
            topColors: [],
            topShades: [],
            topAromas: [],
            topFlavors: [],
            tasteCharacteristics: [],
        };
    }

    if (Array.isArray(data.byYear) && (data.byYear.length > 0 || data.allYears)) {
        const byYear = getSortedYears(data.byYear);
        const allYears =
            data.allYears ??
            ({
                ...createAggregateFromYears(byYear),
                reviewers: data.reviewers ?? null,
            } as IWineEvolutionAggregate);
        const normalizedAllYears = {
            ...allYears,
            reviewers: allYears.reviewers ?? data.reviewers ?? null,
            topColors: allYears.topColors ?? data.topColors ?? [],
            topAromas: allYears.topAromas ?? data.topAromas ?? [],
            topFlavors: allYears.topFlavors ?? data.topFlavors ?? [],
        };

        return {
            ...data,
            currentYear: data.currentYear ?? byYear[0]?.year ?? new Date().getFullYear(),
            years: data.years?.length ? data.years : byYear.map(item => item.year),
            byYear,
            allYears: normalizedAllYears,
            reviewers: data.reviewers ?? normalizedAllYears.reviewers,
            topColors: data.topColors ?? normalizedAllYears.topColors ?? [],
            topShades: data.topShades ?? [],
            topAromas: data.topAromas ?? normalizedAllYears.topAromas ?? [],
            topFlavors: data.topFlavors ?? normalizedAllYears.topFlavors ?? [],
            tasteCharacteristics: data.tasteCharacteristics ?? [],
        };
    }

    const year = data.vintage ?? data.currentYear ?? new Date().getFullYear();
    const yearData: IWineEvolutionYear = {
        year,
        reviewCount: data.reviewCount ?? 0,
        avgUserRating: data.avgUserRating ?? null,
        avgExpertRating: data.avgExpertRating ?? null,
        ratingByGroup: data.ratingByGroup ?? createEmptyRatingByGroup(),
        winePeak: createWinePeakFromDistribution(data.winePeaks),
        topColors: data.topColors ?? [],
        topAromas: data.topAromas ?? [],
        topFlavors: data.topFlavors ?? [],
        reviewers: data.reviewers ?? null,
    };

    return {
        ...data,
        currentYear: data.currentYear ?? new Date().getFullYear(),
        years: data.years ?? [year],
        byYear: [yearData],
        allYears: {
            ...yearData,
            reviewers: data.reviewers ?? null,
            topColors: data.topColors ?? [],
            topAromas: data.topAromas ?? [],
            topFlavors: data.topFlavors ?? [],
        },
        topColors: data.topColors ?? [],
        topShades: data.topShades ?? [],
        topAromas: data.topAromas ?? [],
        topFlavors: data.topFlavors ?? [],
        tasteCharacteristics: data.tasteCharacteristics ?? [],
    };
};

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
): peak is NonNullable<IWineEvolutionYear['winePeak']> => peak !== null && peak.from !== null && peak.to !== null;

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

type EvolutionCarouselField = 'topColors' | 'topAromas' | 'topFlavors';

const createEvolutionCarouselCards = (
    idPrefix: string,
    allYearsTitle: string,
    years: IWineEvolutionYear[],
    allYears: IWineEvolutionAggregate | undefined,
    field: EvolutionCarouselField,
    fallbackColors: string[],
    t: ILocalization['t'],
): IWineEvolutionCarouselCard[] => {
    const cards: IWineEvolutionCarouselCard[] = [];
    const addCard = (
        id: string,
        title: string,
        statistics: IWineEvolutionStatistic[] | undefined,
        reviewers: IWineEvolutionYear['reviewers'],
    ) => {
        const card = createAggregateCarouselCards(id, title, statistics ?? [], reviewers ?? null, fallbackColors, t)[0];

        if (card) {
            cards.push(card);
        }
    };

    addCard(`${idPrefix}-all`, allYearsTitle, allYears?.[field], allYears?.reviewers);

    getSortedYears(years).forEach(yearData => {
        addCard(`${idPrefix}-${yearData.year}`, `${yearData.year}`, yearData[field], yearData.reviewers);
    });

    return cards;
};

const createEvolutionExpertAssessments = (data: IWineEvolutionYear[]): IWineEvolutionExpertAssessment[] =>
    getSortedYears(data)
        .filter(item => item.reviewCount > 0)
        .map(item => ({
            id: `tasting-${item.year}`,
            year: `${item.year}`,
            proScore: item.avgExpertRating,
            userScore: item.avgUserRating,
        }));

const createSeries = (
    id: string,
    values: Array<number | null>,
    color: string,
    minValue: number,
    maxValue: number,
    plotWidth: number,
    plotHeight: number,
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
        points: validPoints.map(point => ({ ...point, value: values[point.index] as number })),
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
        ? [createSeries(id, values, color, minValue, maxValue, plotWidth, plotHeight)]
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
        const values = chartYears.map(year => getNormalizedTasteValue(characteristic.levels, valuesByYear.get(year)));
        const aggregateValue = characteristic.allYears ?? {
            avgLevelId: characteristic.avgLevelId ?? null,
            avgSortNumber: characteristic.avgSortNumber ?? null,
        };
        const hasYearValues = values.some(value => value !== null);
        const aggregateChartValue = getNormalizedTasteValue(characteristic.levels, aggregateValue);
        const chartValues = hasYearValues ? values : aggregateChartValue === null ? [] : [aggregateChartValue];
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
            ),
        ];
    });
};

const createEvolutionAssessmentChart = (
    data: IWineEvolutionYear[],
    years: number[],
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
    const chartYears = getChartYears(
        years,
        getSortedYears(data).map(item => item.year),
    );
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
    const [evolutionData, setEvolutionData] = useState<IWineEvolutionResponse | null>(null);
    const [isEvolutionLoading, setIsEvolutionLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState('');
    const [draftYear, setDraftYear] = useState('');
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
    const chartColors = useMemo(() => getChartColors(colors), [colors]);
    const carouselItemWidth = scaleHorizontal(233);

    const onConfigureCarouselPanGesture = useCallback((panGesture: PanGesture) => {
        const configurablePanGesture = panGesture as unknown as IConfigurablePanGesture;
        configurablePanGesture.activeOffsetX([-CAROUSEL_ACTIVE_OFFSET_X, CAROUSEL_ACTIVE_OFFSET_X]);
        configurablePanGesture.failOffsetY([-CAROUSEL_FAIL_OFFSET_Y, CAROUSEL_FAIL_OFFSET_Y]);
    }, []);

    const getEvolution = useCallback(async () => {
        setIsEvolutionLoading(true);

        try {
            const response = await wineService.getEvolution(wineId);

            if (!response.isError && response.data) {
                setEvolutionData(normalizeEvolutionResponse(response.data, wineId));
            }
        } finally {
            setIsEvolutionLoading(false);
        }
    }, [wineId]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            getEvolution();
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [getEvolution]);

    useEffect(() => {
        onRegisterRefresh(getEvolution);

        return () => onRegisterRefresh(null);
    }, [getEvolution, onRegisterRefresh]);

    const allYearsTitle = t('wine.evolution.allYears');
    const tastingYears = useMemo(() => {
        const apiYears = (evolutionData?.years ?? []).filter(year => Number.isFinite(year));

        if (apiYears.length) {
            return [...new Set(apiYears)].sort((first, second) => second - first).map(year => `${year}`);
        }

        return getTastingYears(evolutionData?.currentYear ?? new Date().getFullYear(), [
            ...(evolutionData?.vintage ? [evolutionData.vintage] : []),
        ]);
    }, [evolutionData]);
    const yearValues = useMemo(() => [ALL_YEARS_VALUE, ...tastingYears], [tastingYears]);
    const activeYear = yearValues.includes(selectedYear)
        ? selectedYear
        : (tastingYears[0] ?? `${evolutionData?.currentYear ?? new Date().getFullYear()}`);
    const activeDraftYear = yearValues.includes(draftYear) ? draftYear : activeYear;
    const selectedEvolution = useMemo<IWineEvolutionYear | IWineEvolutionAggregate | undefined>(() => {
        if (!evolutionData) {
            return undefined;
        }

        if (activeYear === ALL_YEARS_VALUE) {
            return evolutionData.allYears;
        }

        const years = Array.isArray(evolutionData.byYear) ? evolutionData.byYear : [];

        return years.find(item => `${item.year}` === activeYear);
    }, [activeYear, evolutionData]);

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
    const onYearConfirm = useCallback(() => {
        setSelectedYear(activeDraftYear);
        setIsYearPickerVisible(false);
    }, [activeDraftYear]);

    const onMenToggle = useCallback(() => setAudienceVisibility(current => ({ ...current, men: !current.men })), []);
    const onWomenToggle = useCallback(
        () => setAudienceVisibility(current => ({ ...current, women: !current.women })),
        [],
    );

    const expertAssessments = useMemo(
        () => createEvolutionExpertAssessments(evolutionData?.byYear ?? []),
        [evolutionData?.byYear],
    );
    const connectedColorCards = useMemo(
        () =>
            createEvolutionCarouselCards(
                'all-colors',
                allYearsTitle,
                evolutionData?.byYear ?? [],
                evolutionData?.allYears,
                'topColors',
                chartColors,
                t,
            ),
        [allYearsTitle, chartColors, evolutionData?.allYears, evolutionData?.byYear, t],
    );
    const connectedAromaCards = useMemo(
        () =>
            createEvolutionCarouselCards(
                'all-aromas',
                allYearsTitle,
                evolutionData?.byYear ?? [],
                evolutionData?.allYears,
                'topAromas',
                chartColors,
                t,
            ),
        [allYearsTitle, chartColors, evolutionData?.allYears, evolutionData?.byYear, t],
    );
    const connectedTasteCards = useMemo(
        () =>
            createEvolutionCarouselCards(
                'all-tastes',
                allYearsTitle,
                evolutionData?.byYear ?? [],
                evolutionData?.allYears,
                'topFlavors',
                chartColors,
                t,
            ),
        [allYearsTitle, chartColors, evolutionData?.allYears, evolutionData?.byYear, t],
    );
    const connectedLineCharts = useMemo(
        () =>
            createEvolutionLineCharts(
                evolutionData?.tasteCharacteristics ?? [],
                evolutionData?.years ?? [],
                chartColors,
                METRIC_GRAPH_PLOT_WIDTH,
                allYearsTitle,
                t,
            ),
        [allYearsTitle, chartColors, evolutionData?.tasteCharacteristics, evolutionData?.years, t],
    );
    const connectedAssessmentChart = useMemo(
        () =>
            createEvolutionAssessmentChart(
                evolutionData?.byYear ?? [],
                evolutionData?.years ?? [],
                chartColors,
                SUMMARY_GRAPH_PLOT_WIDTH,
                audienceVisibility,
                onMenToggle,
                onWomenToggle,
                t,
            ),
        [audienceVisibility, chartColors, evolutionData?.byYear, evolutionData?.years, onMenToggle, onWomenToggle, t],
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
    const onExpertProgressChange = useCallback(
        (_: number, absoluteProgress: number) => {
            setExpertActiveIndex(getCarouselIndex(expertAssessments.length, absoluteProgress));
        },
        [expertAssessments.length, getCarouselIndex],
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
    const selectedWinePeak = isWinePeakAvailable(selectedEvolution?.winePeak ?? null)
        ? selectedEvolution?.winePeak
        : null;
    const winePeakYear = selectedWinePeak
        ? selectedWinePeak.from === selectedWinePeak.to
            ? `${selectedWinePeak.from}`
            : `${selectedWinePeak.from}-${selectedWinePeak.to}`
        : NO_DATA;
    const winePeakReviews = selectedWinePeak
        ? `(${selectedWinePeak.distribution.reduce((total, item) => total + item.userCount, 0)})`
        : NO_DATA;

    return {
        tastingYear: activeYear === ALL_YEARS_VALUE ? allYearsTitle : activeYear,
        proAssessmentScore,
        wineLoverScore,
        hasProAssessment: proAssessmentScore !== null,
        hasWineLoverScore: wineLoverScore !== null,
        winePeakYear,
        winePeakReviews,
        hasWinePeak: selectedWinePeak !== null,
        isInitialLoading: isEvolutionLoading && evolutionData === null,
        isYearPickerVisible,
        yearOptions,
        expertAssessments,
        expertActiveIndex: Math.min(expertActiveIndex, Math.max(expertAssessments.length - 1, 0)),
        expertCarouselRef,
        onExpertProgressChange,
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
