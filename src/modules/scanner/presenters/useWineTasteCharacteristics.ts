import { FeaturesKeysEnum } from '@/entities/features/enums/FeaturesKeysEnum';
import { featuresModel } from '@/entities/features/FeaturesModel';
import { wineModel } from '@/entities/wine/WineModel';
import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';


const MOCK_DATA = [
    {
        id: 1,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "#111111",
        isPremium: false,
    },

    {
        id: 2,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "red",
        isPremium: false,
    },

    {
        id: 3,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "green",
        isPremium: false,
    },

    {
        id: 4,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "yellow",
        isPremium: true,
    },

    {
        id: 5,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "blue",
        isPremium: true,
    },

    {
        id: 6,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "pink",
        isPremium: true,
    },

    {
        id: 7,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "orange",
        isPremium: true,
    },
    {
        id: 8,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "orange",
        isPremium: true,
    },
    {
        id: 9,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "orange",
        isPremium: true,
    },
    {
        id: 10,
        name: "Солодкість",
        description: "Якийсь опис",
        levels: ['Сухе', 'Напів сухе', 'Солодке', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе', 'Напів сухе'],
        colorHex: "orange",
        isPremium: true,
    },
]


export const useWineTasteCharacteristics = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
    const data = wineModel.tasteCharacteristics;
    const isPremiumUser = useMemo(
        () => featuresModel.features?.find(feature => feature.key === FeaturesKeysEnum.TASTING_NOTES)?.isEnabled || false,
        [],
    );

    const getTasteCharacteristics = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine?.id) return;

            setIsLoading(true);

            // const payload = {
            //     colorId: wineModel.base?.colorOfWine.id,
            // };

            // const response = await wineService.getTastes(payload);

            // if (response.isError || !response.data) {
            //     if (response.message) {
            //         toastService.showError(localization.t('common.errorHappened'), response.message);
            //         setIsError(true);
            //     }
            // } else {
            //     setIsError(false);
            // }

            wineModel.tasteCharacteristics = MOCK_DATA;
        } catch (error) {
            console.error('getTasteCharacteristics error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getTasteCharacteristics();
    }, [getTasteCharacteristics]);

    useEffect(() => {
        if (!data || data.length === 0) {
            setSliderValues({});
            return;
        }

        setSliderValues(prev => {
            const next: Record<number, number> = {};

            data.forEach(item => {
                const maxLevel = Math.max(item.levels?.length ?? 1, 1);
                const prevValue = prev[item.id] ?? 1;
                next[item.id] = Math.min(Math.max(prevValue, 1), maxLevel);
            });

            return next;
        });
    }, [data]);

    useEffect(() => {
        return () => {
            wineModel.tasteCharacteristics = null;
        };
    }, []);

    const handleSliderChange = useCallback((id: number, value: number) => {
        setSliderValues(prev => {
            const maxLevel = data?.find(characteristic => characteristic.id === id)?.levels.length ?? value;
            const nextValue = Math.min(Math.max(value, 1), maxLevel || 1);

            return { ...prev, [id]: nextValue };
        });
    }, [data]);

    const handleNextPress = useCallback(() => {
        if (data) {
            wineModel.tasteCharacteristics = data.map(item => ({
                ...item,
                selectedLevel: sliderValues[item.id] ?? 1,
            }));
        }

        // navigation.navigate('WineTasteCharacteristicsView');
    }, [data, navigation, sliderValues]);

    return { data, isError, getTasteCharacteristics, handleSliderChange, isLoading, handleNextPress, sliderValues, isPremiumUser };
};
