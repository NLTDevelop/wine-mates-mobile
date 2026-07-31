import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import { scaleHorizontal } from '@/utils';
import { getContrastColor } from '@/utils';
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

const formatScore = (value: number | null) => (value === null ? NO_DATA : value.toFixed(1));

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
                reviewsText: `(${item.ratingByGroup.men[ageKey].count})`,
            })),
        },
        {
            label: 'Women',
            ratings: AMATEUR_AGE_KEYS.map(ageKey => ({
                score: item.ratingByGroup.women[ageKey].avg,
                reviews: item.ratingByGroup.women[ageKey].count,
                scoreText: formatScore(item.ratingByGroup.women[ageKey].avg),
                reviewsText: `(${item.ratingByGroup.women[ageKey].count})`,
            })),
        },
    ];
};

const createEvolutionStatistic = (item: IWineEvolutionStatistic): IWineEvolutionColorStat => ({
    label: item.name,
    reviews: item.userCount,
    reviewsText: `(${item.userCount} Reviews)`,
    backgroundColor: item.colorHex,
    textColor: getContrastColor(item.colorHex),
});

const createEvolutionCarouselCards = (
    data: IWineEvolutionVintage[],
    getStatistics: (item: IWineEvolutionVintage) => IWineEvolutionStatistic[],
): IWineEvolutionCarouselCard[] => {
    return data.map((item, index) => {
        const statistics = getStatistics(item).slice(0, 5);
        const peopleCount = statistics.reduce((total, statistic) => total + statistic.userCount, 0);

        return {
            id: `evolution-card-${item.vintage ?? 'none'}-${index}`,
            year: item.vintage === null ? NO_DATA : `${item.vintage}`,
            colors: statistics.map(createEvolutionStatistic),
            avatarSources: [],
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
        year: item.vintage === null ? NO_DATA : `${item.vintage}`,
        score: item.avgExpertRating,
    }));
};

const getCharacteristicValue = (item: IWineEvolutionVintage, name: string): number | null => {
    const characteristic = item.tasteCharacteristics.find(
        (tasteCharacteristic: IWineEvolutionTasteCharacteristic) =>
            tasteCharacteristic.name.toLowerCase() === name.toLowerCase(),
    );

    return characteristic?.avgSortNumber ?? null;
};

const createSeries = (
    id: string,
    values: number[],
    color: string,
    minValue: number,
    maxValue: number,
    plotWidth: number,
    plotHeight: number,
): IWineEvolutionLineSeries => {
    const points = values.map((value, index) => {
        const x = values.length > 1 ? (plotWidth / (values.length - 1)) * index : 0;
        const y = plotHeight - ((value - minValue) / (maxValue - minValue)) * plotHeight;

        return { x, y };
    });

    return {
        id,
        color,
        points: points.map(point => `${point.x},${point.y}`).join(' '),
        lastPoint: points[points.length - 1],
    };
};

const createChart = (
    id: string,
    title: string,
    yAxisLabels: string[],
    values: number[],
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
    series: values.length ? [createSeries(id, values, color, minValue, maxValue, plotWidth, plotHeight)] : [],
});

const createEvolutionLineCharts = (
    data: IWineEvolutionVintage[],
    chartColors: string[],
    plotWidth: number,
): IWineEvolutionChart[] => {
    const chartYears = data.map(item => (item.vintage === null ? NO_DATA : `${item.vintage}`));
    const compactPlotHeight = 193;
    const chartDefinitions = [
        { id: 'sweetness', title: 'Sweetness', labels: ['very sweet', 'semisweet', 'dry'], maxValue: 3 },
        { id: 'acidity', title: 'Acidity', labels: ['high', 'medium', 'low'], maxValue: 3 },
        { id: 'tannin', title: 'Tannin', labels: ['high', 'medium', 'low'], maxValue: 3 },
        { id: 'body', title: 'Body', labels: ['saturated', 'dense', 'medium', 'light', 'ultralight'], maxValue: 4 },
        { id: 'aftertaste', title: 'Aftertaste', labels: ['long >45 sec', 'medium', 'short <10 sec'], maxValue: 3 },
        { id: 'alcohol', title: 'Alcohol', labels: ['high', 'medium', 'low'], maxValue: 3 },
    ];

    return chartDefinitions.map((definition, index) => {
        const values = data.map(item => getCharacteristicValue(item, definition.title));
        const gridY = definition.maxValue === 4 ? [12, 54, 96, 138, 181] : [24, 96, 168];

        return createChart(
            definition.id,
            definition.title,
            definition.labels,
            values.every((value): value is number => value !== null) ? values : [],
            chartColors[index],
            0,
            definition.maxValue,
            plotWidth,
            compactPlotHeight,
            gridY,
            chartYears,
        );
    });
};

const createEvolutionAssessmentChart = (
    data: IWineEvolutionVintage[],
    chartColors: string[],
    plotWidth: number,
): IWineEvolutionChart => {
    const ageKeys = ['18_25', '26_35', '36_45'] as const;
    const groupSeries = [
        { id: 'men', group: 'men' as const, ageKey: ageKeys[0] },
        { id: 'men', group: 'men' as const, ageKey: ageKeys[1] },
        { id: 'men', group: 'men' as const, ageKey: ageKeys[2] },
        { id: 'women', group: 'women' as const, ageKey: ageKeys[0] },
        { id: 'women', group: 'women' as const, ageKey: ageKeys[1] },
        { id: 'women', group: 'women' as const, ageKey: ageKeys[2] },
    ];
    const plotHeight = 282;

    return {
        id: 'assessment-over-years',
        title: 'Dynamics of the assessment over the years',
        yAxisLabels: ['5', '4', '3', '2', '1', '0'],
        xAxisLabels: data.map(item => (item.vintage === null ? NO_DATA : `${item.vintage}`)),
        gridY: [16, 66, 116, 166, 216, 266],
        plotWidth,
        plotHeight,
        strokeWidth: 1.5,
        series: data.length
            ? groupSeries.flatMap((series, index) => {
                  const values = data.map(item => item.ratingByGroup[series.group][series.ageKey].avg);

                  return values.every((value): value is number => value !== null)
                      ? [
                            createSeries(
                                `assessment-${series.id}-${series.ageKey}`,
                                values,
                                chartColors[index],
                                0,
                                5,
                                plotWidth,
                                plotHeight,
                            ),
                        ]
                      : [];
              })
            : [],
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
        const years = evolutionData.map(item => item.vintage).filter((vintage): vintage is number => vintage !== null);

        return years.length ? years.map(year => `${year}`) : [NO_DATA];
    }, [evolutionData]);

    const activeYear = evolutionYears.includes(selectedYear) ? selectedYear : evolutionYears[0];
    const activeDraftYear = evolutionYears.includes(draftYear) ? draftYear : activeYear;

    const selectedEvolution = useMemo(() => {
        return evolutionData.find(item => (item.vintage === null ? NO_DATA : `${item.vintage}`) === activeYear);
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

    const connectedLineCharts = useMemo(
        () => createEvolutionLineCharts(evolutionData, chartColors, graphPlotWidth),
        [chartColors, evolutionData, graphPlotWidth],
    );

    const connectedAssessmentChart = useMemo(
        () => createEvolutionAssessmentChart(evolutionData, chartColors, graphPlotWidth),
        [chartColors, evolutionData, graphPlotWidth],
    );

    const expertAssessments = useMemo(() => createEvolutionExpertAssessments(evolutionData), [evolutionData]);

    const connectedColorCards = useMemo(() => {
        return evolutionData.length
            ? createEvolutionCarouselCards(evolutionData, item => [...item.topColors, ...item.topShades])
            : [createEmptyCarouselCard('color-empty')];
    }, [evolutionData]);

    const connectedAromaCards = useMemo(() => {
        return evolutionData.length
            ? createEvolutionCarouselCards(evolutionData, item => item.topAromas)
            : [createEmptyCarouselCard('aroma-empty')];
    }, [evolutionData]);

    const connectedTasteCards = useMemo(() => {
        return evolutionData.length
            ? createEvolutionCarouselCards(evolutionData, item => item.topFlavors)
            : [createEmptyCarouselCard('taste-empty')];
    }, [evolutionData]);

    useEffect(() => {
        setExpertActiveIndex(index => Math.min(index, Math.max(expertAssessments.length - 1, 0)));
        setColorActiveIndex(index => Math.min(index, Math.max(connectedColorCards.length - 1, 0)));
        setAromaActiveIndex(index => Math.min(index, Math.max(connectedAromaCards.length - 1, 0)));
        setTasteActiveIndex(index => Math.min(index, Math.max(connectedTasteCards.length - 1, 0)));
    }, [connectedAromaCards.length, connectedColorCards.length, connectedTasteCards.length, expertAssessments.length]);

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
        expertActiveIndex,
        expertCarouselRef,
        colorCards: connectedColorCards,
        colorActiveIndex,
        colorCarouselRef,
        aromaCards: connectedAromaCards,
        aromaActiveIndex,
        aromaCarouselRef,
        tasteCards: connectedTasteCards,
        tasteActiveIndex,
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
