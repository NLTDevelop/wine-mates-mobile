import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { declOfWord, getContrastColor, scaleHorizontal, scaleVertical } from '@/utils';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';
import { IColors } from '@/UIProvider/theme/IColors';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { wineService } from '@/entities/wine/services/WineService';
import {
    IWineEvolutionAggregate,
    IWineEvolutionByYear,
    IWineEvolutionResponse,
    IWineEvolutionStatistic,
    IWineEvolutionTasteCharacteristic,
    IWineEvolutionYear,
    IWineEvolutionYearValue,
} from '@/entities/wine/types/IWineEvolution';
import { IColorStatistic } from '@/entities/wine/types/IColorStatistic';
import {
    IWineEvolutionCarouselCard,
    IWineEvolutionChart,
    IWineEvolutionColorStat,
    IWineEvolutionExpertAssessment,
    IWineEvolutionLineSeries,
    IWineEvolutionRatingRow,
} from '@/modules/wine/types/IWineEvolution';
import { EVOLUTION_CHART_VISIBLE_YEARS } from '../../EvolutionLineChartCard/constants';
import { getWineLoverRatingDescription } from '@/UIKit/RateThisWine/utils/getWineLoverRatingDescription';
import { createColorShadeItems } from '@/modules/wine/presenters/createColorShadeItems';

const NO_DATA = '-';
const ALL_YEARS_VALUE = 'all';
const CHART_VERTICAL_PADDING = 8;
const CHART_MARKER_RADIUS = 4;
const CHART_LEADING_LINE_LENGTH = scaleHorizontal(16);
const AMATEUR_AGE_GROUPS = ['18-25', '26-35', '36-45', '46-60', '60+'];
const AMATEUR_AGE_KEYS = ['18_25', '26_35', '36_45', '46_60', '60_plus'] as const;
const METRIC_GRAPH_PLOT_WIDTH = scaleHorizontal(233);
const SUMMARY_GRAPH_PLOT_WIDTH = scaleHorizontal(276);
const ASSESSMENT_MAX_VALUE = 5;
const ASSESSMENT_Y_AXIS_STEP = 0.5;

type AudienceGroup = 'men' | 'women';
type AmateurAgeKey = (typeof AMATEUR_AGE_KEYS)[number];
type AgeGroupVisibility = Record<string, boolean>;
type AudienceVisibility = Record<AudienceGroup, boolean>;
type OnAgeGroupToggle = (group: AudienceGroup, ageKey: AmateurAgeKey) => () => void;

const getChartColors = (colors: IColors) => [
    colors.evolutionChartRed,
    colors.evolutionChartGreen,
    colors.evolutionChartBlue,
    colors.evolutionChartYellow,
    colors.evolutionChartPurple,
    colors.evolutionChartBurgundy,
];

const getChartBackgroundColors = (colors: IColors) => [
    colors.evolutionChartRedBackground,
    colors.evolutionChartGreenBackground,
    colors.evolutionChartBlueBackground,
    colors.evolutionChartYellowBackground,
    colors.evolutionChartPurpleBackground,
];

const getWomenChartColors = (colors: IColors) => [
    colors.evolutionChartWomenMagenta,
    colors.evolutionChartWomenTeal,
    colors.evolutionChartWomenOrange,
    colors.evolutionChartWomenSlate,
    colors.evolutionChartWomenBrown,
];

const getWomenChartBackgroundColors = (colors: IColors) => [
    colors.evolutionChartWomenMagentaBackground,
    colors.evolutionChartWomenTealBackground,
    colors.evolutionChartWomenOrangeBackground,
    colors.evolutionChartWomenSlateBackground,
    colors.evolutionChartWomenBrownBackground,
];

const formatScore = (value: number | null) => (value === null ? NO_DATA : value.toFixed(1));

const getAgeGroupId = (group: AudienceGroup, ageKey: AmateurAgeKey) => `${group}-${ageKey}`;

const createInitialAgeGroupVisibility = (): AgeGroupVisibility => {
    const visibility: AgeGroupVisibility = {};

    (['men', 'women'] as const).forEach(group => {
        AMATEUR_AGE_KEYS.forEach(ageKey => {
            visibility[getAgeGroupId(group, ageKey)] = true;
        });
    });

    return visibility;
};

const getSortedYears = (years: IWineEvolutionYear[]) =>
    (Array.isArray(years) ? [...years] : []).sort((first, second) => second.year - first.year);

const createEmptyRatingRows = (t: ILocalization['t']): IWineEvolutionRatingRow[] =>
    (['men', 'women'] as const).map(group => ({
        label: t(`wine.evolution.${group}`),
        ratings: AMATEUR_AGE_KEYS.map(() => ({
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

const createEvolutionCarouselCard = <T extends IWineEvolutionStatistic>(
    id: string,
    title: string,
    statistics: T[],
    reviewers: IWineEvolutionAggregate['reviewers'],
    fallbackColors: string[],
    t: ILocalization['t'],
    shouldUseColorShades = false,
): IWineEvolutionCarouselCard => {
    const availableStatistics = Array.isArray(statistics) ? statistics : [];
    const visibleColors = shouldUseColorShades
        ? createColorShadeItems(availableStatistics as unknown as IColorStatistic[], t)
              .map(item => ({
                  label: item.label,
                  reviews: item.reviews,
                  reviewsText: item.count,
                  backgroundColor: item.colorHex,
                  textColor: getContrastColor(item.colorHex),
              }))
        : availableStatistics
              .map((statistic, index) =>
                  createEvolutionStatistic(statistic, fallbackColors[index % fallbackColors.length], t),
              );

    const avatarItems = (reviewers?.users ?? []).slice(0, 4).map(user => ({
        id: user.id,
        avatarUrl: user.avatar?.mediumUrl || user.avatar?.smallUrl || user.avatar?.originalUrl || null,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
    }));
    const totalReviewers = reviewers?.totalCount ?? 0;
    const additionalPeople = Math.max(0, totalReviewers - avatarItems.length);

    return {
        id,
        year: title,
        colors: visibleColors,
        avatarItems,
        additionalPeople,
        additionalPeopleText: additionalPeople ? `+${additionalPeople}` : '',
        isEmpty: !visibleColors.length,
    };
};

const createEvolutionCarouselCards = <T extends IWineEvolutionStatistic>(
    id: string,
    allYearsTitle: string,
    statistics: IWineEvolutionByYear<T[], IWineEvolutionYearValue<T>>,
    reviewers: IWineEvolutionResponse['reviewers'],
    fallbackColors: string[],
    t: ILocalization['t'],
    shouldUseColorShades = false,
): IWineEvolutionCarouselCard[] => {
    const reviewersByYear = new Map(reviewers.byYear.map(item => [item.year, item]));
    const allYearsCard = createEvolutionCarouselCard(
        `${id}-${ALL_YEARS_VALUE}`,
        allYearsTitle,
        statistics.allYears,
        reviewers.allYears,
        fallbackColors,
        t,
        shouldUseColorShades,
    );

    if (allYearsCard.isEmpty) {
        return [];
    }

    const yearCards = [...statistics.byYear]
        .filter(item => item.items.length > 0)
        .sort((first, second) => second.year - first.year)
        .map(item =>
            createEvolutionCarouselCard(
                `${id}-${item.year}`,
                `${item.year}`,
                item.items,
                reviewersByYear.get(item.year) ?? null,
                fallbackColors,
                t,
                shouldUseColorShades,
            ),
        );

    return [allYearsCard, ...yearCards];
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
    const chartHeight = Math.max(plotHeight - CHART_VERTICAL_PADDING * 2, 1);
    const valueRange = maxValue - minValue || 1;
    const xAxisSlotsCount = Math.max(values.length, EVOLUTION_CHART_VISIBLE_YEARS);
    const xAxisSlotWidth = plotWidth / xAxisSlotsCount;
    const points = values.map((value, index) => {
        if (value === null) {
            return null;
        }

        const x = xAxisSlotWidth * (index + 0.5);
        const normalizedValue = Math.min(1, Math.max(0, (value - minValue) / valueRange));
        const y = plotHeight - CHART_VERTICAL_PADDING - normalizedValue * chartHeight;

        return { x, y };
    });
    const validPoints = points
        .map((point, index) => (point ? { ...point, index } : null))
        .filter((point): point is { index: number; x: number; y: number } => point !== null);
    const shouldRenderLeadingLine = validPoints.length === 1;
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

        if (!currentSegment.length) {
            if (shouldRenderLeadingLine) {
                const leadingLineStartX = Math.max(0, point.x - CHART_LEADING_LINE_LENGTH);

                currentSegment.push(`M ${leadingLineStartX} ${point.y} L ${point.x} ${point.y}`);
                return;
            }

            currentSegment.push(`M ${point.x} ${point.y}`);
            return;
        }

        currentSegment.push(`L ${point.x} ${point.y}`);
    });

    if (currentSegment.length) {
        pathParts.push(currentSegment.join(' '));
    }

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
    gridLineCount = 3,
): IWineEvolutionChart => ({
    id,
    title,
    yAxisLabels,
    xAxisLabels,
    gridY: Array.from({ length: gridLineCount }, (_, index) => {
        const gridIntervals = Math.max(gridLineCount - 1, 1);

        return (
            CHART_VERTICAL_PADDING +
            ((plotHeight - CHART_VERTICAL_PADDING * 2) * index) / gridIntervals
        );
    }),
    plotWidth,
    plotHeight,
    strokeWidth: 2,
    series: values.some(value => value !== null)
        ? [createSeries(id, values, color, minValue, maxValue, plotWidth, plotHeight, valueTexts)]
        : [],
    audienceControls,
});

const getScrollablePlotWidth = (visiblePlotWidth: number, yearsCount: number) =>
    yearsCount <= EVOLUTION_CHART_VISIBLE_YEARS
        ? visiblePlotWidth
        : (visiblePlotWidth / EVOLUTION_CHART_VISIBLE_YEARS) * yearsCount;

const getChartYears = (years: number[], fallbackYears: number[] = []) => {
    const sourceYears = years.length ? years : fallbackYears;

    return [...new Set(sourceYears.filter(year => Number.isFinite(year)))].sort((first, second) => first - second);
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

const createEvolutionLineCharts = (
    characteristics: IWineEvolutionTasteCharacteristic[],
    years: number[],
    chartColors: string[],
    plotWidth: number,
    allYearsTitle: string,
): IWineEvolutionChart[] => {
    const availableCharacteristics = Array.isArray(characteristics) ? characteristics : [];

    return availableCharacteristics.map((characteristic, index) => {
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

        const chartPlotWidth = getScrollablePlotWidth(plotWidth, xAxisLabels.length);

        return createChart(
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
            undefined,
            characteristic.levels.length,
        );
    });
};

const createEvolutionAssessmentChart = (
    data: IWineEvolutionYear[],
    years: number[],
    fallbackYear: number,
    chartColors: string[],
    chartBackgroundColors: string[],
    womenChartColors: string[],
    womenChartBackgroundColors: string[],
    plotWidth: number,
    audienceVisibility: AudienceVisibility,
    ageGroupVisibility: AgeGroupVisibility,
    onMenToggle: () => void,
    onWomenToggle: () => void,
    onAgeGroupToggle: OnAgeGroupToggle,
    t: ILocalization['t'],
): IWineEvolutionChart => {
    const audienceControls: NonNullable<IWineEvolutionChart['audienceControls']> = [
        {
            id: 'men',
            title: t('wine.evolution.men'),
            isActive: audienceVisibility.men,
            onPress: onMenToggle,
            ageControls: AMATEUR_AGE_KEYS.map((ageKey, index) => ({
                id: getAgeGroupId('men', ageKey),
                title: AMATEUR_AGE_GROUPS[index],
                color: chartColors[index],
                backgroundColor: chartBackgroundColors[index],
                isActive:
                    audienceVisibility.men &&
                    (ageGroupVisibility[getAgeGroupId('men', ageKey)] ?? true),
                onPress: onAgeGroupToggle('men', ageKey),
            })),
        },
        {
            id: 'women',
            title: t('wine.evolution.women'),
            isActive: audienceVisibility.women,
            onPress: onWomenToggle,
            ageControls: AMATEUR_AGE_KEYS.map((ageKey, index) => ({
                id: getAgeGroupId('women', ageKey),
                title: AMATEUR_AGE_GROUPS[index],
                color: womenChartColors[index],
                backgroundColor: womenChartBackgroundColors[index],
                isActive:
                    audienceVisibility.women &&
                    (ageGroupVisibility[getAgeGroupId('women', ageKey)] ?? true),
                onPress: onAgeGroupToggle('women', ageKey),
            })),
        },
    ];
    const groupSeries = audienceControls.flatMap(control =>
        AMATEUR_AGE_KEYS.map((ageKey, index) => ({
            id: getAgeGroupId(control.id, ageKey),
            group: control.id,
            ageKey,
            color: control.ageControls[index].color,
        })),
    );
    const availableChartYears = getChartYears(
        years,
        getSortedYears(data).map(item => item.year),
    );
    const chartYears = availableChartYears.length ? availableChartYears : [fallbackYear];
    const dataByYear = new Map(getSortedYears(data).map(item => [item.year, item]));
    const chartPlotWidth = getScrollablePlotWidth(plotWidth, chartYears.length);
    const visibleSeries = groupSeries.filter(
        series => audienceVisibility[series.group] && ageGroupVisibility[getAgeGroupId(series.group, series.ageKey)],
    );
    const series = visibleSeries.flatMap(item => {
        const values = chartYears.map(year => {
            const yearData = dataByYear.get(year);
            const groupRating = yearData?.ratingByGroup?.[item.group][item.ageKey];

            return groupRating ? getGroupAverage(groupRating) : null;
        });

        return values.some(value => value !== null)
            ? [
                  createSeries(
                      `assessment-${item.id}`,
                      values,
                      item.color,
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
        yAxisLabels: Array.from(
            { length: ASSESSMENT_MAX_VALUE / ASSESSMENT_Y_AXIS_STEP + 1 },
            (_, index) => {
                const value = ASSESSMENT_MAX_VALUE - index * ASSESSMENT_Y_AXIS_STEP;

                return Number.isInteger(value) ? `${value}` : '';
            },
        ),
        xAxisLabels: chartYears.map(year => `${year}`),
        gridY: Array.from(
            { length: ASSESSMENT_MAX_VALUE / ASSESSMENT_Y_AXIS_STEP + 1 },
            (_, index) =>
                CHART_VERTICAL_PADDING +
                ((scaleVertical(282) - CHART_VERTICAL_PADDING * 2) * index) /
                    (ASSESSMENT_MAX_VALUE / ASSESSMENT_Y_AXIS_STEP),
        ),
        plotWidth: chartPlotWidth,
        plotHeight: scaleVertical(282),
        strokeWidth: 2,
        series,
        audienceControls,
    };
};

interface IProps {
    colors: IColors;
    wineId: number;
    t: ILocalization['t'];
    onRegisterRefresh: (callback: (() => Promise<void>) | null) => void;
}

const getSelectedEvolution = (
    evolution: IWineEvolutionResponse | null,
    year: string,
): IWineEvolutionAggregate | null => {
    if (!evolution) {
        return null;
    }

    if (year === ALL_YEARS_VALUE) {
        return {
            ...evolution.ratings.allYears,
            winePeak: evolution.winePeak.allYears,
            reviewers: evolution.reviewers.allYears,
            topColors: evolution.topColors.allYears,
            topAromas: evolution.topAromas.allYears,
            topFlavors: evolution.topFlavors.allYears,
        };
    }

    const numericYear = Number(year);
    const rating = evolution.ratings.byYear.find(item => item.year === numericYear);

    if (!rating) {
        return null;
    }

    return {
        ...rating,
        winePeak: evolution.winePeak.byYear.find(item => item.year === numericYear) ?? null,
        reviewers: evolution.reviewers.byYear.find(item => item.year === numericYear) ?? null,
        topColors: evolution.topColors.byYear.find(item => item.year === numericYear)?.items ?? [],
        topAromas: evolution.topAromas.byYear.find(item => item.year === numericYear)?.items ?? [],
        topFlavors: evolution.topFlavors.byYear.find(item => item.year === numericYear)?.items ?? [],
    };
};

export const useWineEvolutionTab = ({ colors, wineId, t, onRegisterRefresh }: IProps) => {
    const [evolution, setEvolution] = useState<IWineEvolutionResponse | null>(null);
    const [isEvolutionLoading, setIsEvolutionLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(ALL_YEARS_VALUE);
    const [draftYear, setDraftYear] = useState(ALL_YEARS_VALUE);
    const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);
    const [expertActiveIndex, setExpertActiveIndex] = useState(0);
    const [colorActiveIndex, setColorActiveIndex] = useState(0);
    const [aromaActiveIndex, setAromaActiveIndex] = useState(0);
    const [tasteActiveIndex, setTasteActiveIndex] = useState(0);
    const [audienceVisibility, setAudienceVisibility] = useState({ men: true, women: true });
    const [ageGroupVisibility, setAgeGroupVisibility] = useState<AgeGroupVisibility>(
        createInitialAgeGroupVisibility,
    );
    const chartColors = useMemo(() => getChartColors(colors), [colors]);
    const chartBackgroundColors = useMemo(() => getChartBackgroundColors(colors), [colors]);
    const womenChartColors = useMemo(() => getWomenChartColors(colors), [colors]);
    const womenChartBackgroundColors = useMemo(() => getWomenChartBackgroundColors(colors), [colors]);
    const carouselItemWidth = scaleHorizontal(259);

    const refreshEvolution = useCallback(async () => {
        setIsEvolutionLoading(true);

        try {
            const response = await wineService.getEvolution(wineId);

            if (!response.isError && response.data) {
                setEvolution(response.data);
            }
        } finally {
            setIsEvolutionLoading(false);
        }
    }, [wineId]);

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
        const apiYears = (evolution?.yearOptions ?? evolution?.years ?? [])
            .filter(year => year !== ALL_YEARS_VALUE)
            .map(Number)
            .filter(year => Number.isFinite(year));

        return [...new Set(apiYears)].sort((first, second) => second - first).map(year => `${year}`);
    }, [evolution?.yearOptions, evolution?.years]);
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
    const onYearConfirm = useCallback(() => {
        setIsYearPickerVisible(false);
        setSelectedYear(activeDraftYear);
    }, [activeDraftYear]);

    const onMenToggle = useCallback(() => setAudienceVisibility(current => ({ ...current, men: !current.men })), []);
    const onWomenToggle = useCallback(
        () => setAudienceVisibility(current => ({ ...current, women: !current.women })),
        [],
    );
    const onAgeGroupToggle = useCallback(
        (group: AudienceGroup, ageKey: AmateurAgeKey) => () => {
            const id = getAgeGroupId(group, ageKey);

            setAgeGroupVisibility(current => ({ ...current, [id]: !(current[id] ?? true) }));
        },
        [],
    );

    const expertAssessments = useMemo(
        () => createEvolutionExpertAssessments(evolution?.ratings.byYear ?? []),
        [evolution?.ratings.byYear],
    );
    const selectedEvolution = useMemo(() => getSelectedEvolution(evolution, activeYear), [activeYear, evolution]);
    const connectedColorCards = useMemo(
        () =>
            evolution
                ? createEvolutionCarouselCards(
                      'colors',
                      allYearsTitle,
                      evolution.topColors,
                      evolution.reviewers,
                      chartColors,
                      t,
                      true,
                  )
                : [],
        [allYearsTitle, chartColors, evolution, t],
    );
    const connectedAromaCards = useMemo(
        () =>
            evolution
                ? createEvolutionCarouselCards(
                      'aromas',
                      allYearsTitle,
                      evolution.topAromas,
                      evolution.reviewers,
                      chartColors,
                      t,
                  )
                : [],
        [allYearsTitle, chartColors, evolution, t],
    );
    const connectedTasteCards = useMemo(
        () =>
            evolution
                ? createEvolutionCarouselCards(
                      'tastes',
                      allYearsTitle,
                      evolution.topFlavors,
                      evolution.reviewers,
                      chartColors,
                      t,
                  )
                : [],
        [allYearsTitle, chartColors, evolution, t],
    );
    const connectedLineCharts = useMemo(
        () =>
            createEvolutionLineCharts(
                evolution?.tasteCharacteristics ?? [],
                evolution?.years ?? [],
                chartColors,
                METRIC_GRAPH_PLOT_WIDTH,
                allYearsTitle,
            ),
        [allYearsTitle, chartColors, evolution?.tasteCharacteristics, evolution?.years],
    );
    const connectedAssessmentChart = useMemo(
        () =>
            createEvolutionAssessmentChart(
                evolution?.ratings.byYear ?? [],
                evolution?.years ?? [],
                evolution?.currentYear ?? new Date().getFullYear(),
                chartColors,
                chartBackgroundColors,
                womenChartColors,
                womenChartBackgroundColors,
                SUMMARY_GRAPH_PLOT_WIDTH,
                audienceVisibility,
                ageGroupVisibility,
                onMenToggle,
                onWomenToggle,
                onAgeGroupToggle,
                t,
            ),
        [
            audienceVisibility,
            ageGroupVisibility,
            chartBackgroundColors,
            chartColors,
            womenChartBackgroundColors,
            womenChartColors,
            evolution?.ratings.byYear,
            evolution?.currentYear,
            evolution?.years,
            onMenToggle,
            onWomenToggle,
            onAgeGroupToggle,
            t,
        ],
    );

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
    const onColorScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const nextIndex = Math.round(event.nativeEvent.contentOffset.x / carouselItemWidth);

            setColorActiveIndex(Math.max(0, Math.min(connectedColorCards.length - 1, nextIndex)));
        },
        [carouselItemWidth, connectedColorCards.length],
    );
    const onAromaScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const nextIndex = Math.round(event.nativeEvent.contentOffset.x / carouselItemWidth);

            setAromaActiveIndex(Math.max(0, Math.min(connectedAromaCards.length - 1, nextIndex)));
        },
        [carouselItemWidth, connectedAromaCards.length],
    );
    const onTasteScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const nextIndex = Math.round(event.nativeEvent.contentOffset.x / carouselItemWidth);

            setTasteActiveIndex(Math.max(0, Math.min(connectedTasteCards.length - 1, nextIndex)));
        },
        [carouselItemWidth, connectedTasteCards.length],
    );

    const amateurRatingRows = useMemo(
        () =>
            selectedEvolution
                ? createEvolutionRatingRows(selectedEvolution, t)
                : createEmptyRatingRows(t),
        [selectedEvolution, t],
    );
    const hasSelectedYearData = Boolean(selectedEvolution && selectedEvolution.reviewCount > 0);
    const proAssessmentScore = hasSelectedYearData ? (selectedEvolution?.avgExpertRating ?? null) : null;
    const wineLoverScore = hasSelectedYearData ? (selectedEvolution?.avgUserRating ?? null) : null;
    const wineLoverScoreText = formatScore(wineLoverScore);
    const wineLoverRatingDescription = wineLoverScore === null
        ? NO_DATA
        : getWineLoverRatingDescription(wineLoverScore, t);
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
        wineLoverRatingDescription,
        hasProAssessment: proAssessmentScore !== null,
        hasWineLoverScore: wineLoverScore !== null,
        winePeakYear,
        winePeakReviews,
        hasWinePeak: selectedWinePeak !== null,
        isInitialLoading: isEvolutionLoading && evolution === null,
        isYearPickerVisible,
        yearOptions,
        expertAssessments,
        expertActiveIndex: Math.min(expertActiveIndex, Math.max(expertAssessments.length - 1, 0)),
        onExpertScroll,
        colorCards: connectedColorCards,
        colorActiveIndex: Math.min(colorActiveIndex, Math.max(connectedColorCards.length - 1, 0)),
        onColorScroll,
        aromaCards: connectedAromaCards,
        aromaActiveIndex: Math.min(aromaActiveIndex, Math.max(connectedAromaCards.length - 1, 0)),
        onAromaScroll,
        tasteCards: connectedTasteCards,
        tasteActiveIndex: Math.min(tasteActiveIndex, Math.max(connectedTasteCards.length - 1, 0)),
        onTasteScroll,
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
