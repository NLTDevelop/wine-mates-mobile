import { useCallback, useEffect, useState } from 'react';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { wineService } from '@/entities/wine/WineService';
import { wineListModel } from '@/entities/wine/WineListModel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const LIMIT = 10;
const OFFSET = 0;

const MOCK_DATA = [
    {
        id: 1,
        name: 'My Wine, Cabernet Sauvignon',
        vintage: 2021,
        image_url: 'https://picsum.photos/200/300',
        user: {
            id: 1,
            image_url: 'https://picsum.photos/200',
            firstName: 'Mike',
            lastName: 'Morris'
        },
        review_count: 123,
        review_average: 4.4,
        description:
            'A good bottle of wine is like a time machine. One sip, and you’re back to summer nights, candlelight dinners, and conversations that never ended.',
    },
    {
        id: 2,
        name: 'My Wine, Cabernet Sauvignon',
        vintage: 2021,
        image_url: 'https://picsum.photos/200/300',
        user: {
            id: 1,
            image_url: '',
            firstName: 'John',
            lastName: 'Doe'
        },
        review_count: 123,
        review_average: 4.4,
        description:
            'A good bottle of wine is like a time machine. One sip, and you’re back to summer nights, candlelight dinners, and conversations that never ended.',
    },
    {
        id: 3,
        name: 'My Wine, Cabernet Sauvignon',
        vintage: 2021,
        image_url: 'https://picsum.photos/200/300',
        user: {
            id: 1,
            image_url: 'https://picsum.photos/200',
            firstName: 'John',
            lastName: 'Doe'
        },
        review_count: 123,
        review_average: 4.4,
        description:
            'A good bottle of wine is like a time machine. One sip, and you’re back to summer nights, candlelight dinners, and conversations that never ended.',
    },
    {
        id: 4,
        name: 'My Wine, Cabernet Sauvignon',
        vintage: 2021,
        image_url: 'https://picsum.photos/200/300',
        user: {
            id: 1,
            image_url: 'https://picsum.photos/200',
            firstName: 'John',
            lastName: 'Doe'
        },
        review_count: 123,
        review_average: 4.4,
        description:
            'A good bottle of wine is like a time machine. One sip, and you’re back to summer nights, candlelight dinners, and conversations that never ended.',
    },
    {
        id: 5,
        name: 'My Wine, Cabernet Sauvignon',
        vintage: 2021,
        image_url: 'https://picsum.photos/200/300',
        user: {
            id: 1,
            image_url: 'https://picsum.photos/200',
            firstName: 'John',
            lastName: 'Doe'
        },
        review_count: 123,
        review_average: 4.4,
        description:
            'A good bottle of wine is like a time machine. One sip, and you’re back to summer nights, candlelight dinners, and conversations that never ended.',
    },
];

export const useScannerResultsList = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(false);
    const data = wineListModel.list?.data || MOCK_DATA;

    const getList = useCallback(async (offset: number) => {
        setIsLoading(true);
        const params = {
            limit: LIMIT,
            offset,
        };
        // const response = await wineService.list(params);

        // if (response.isError) {
        //     toastService.showError(
        //         localization.t('errorHappened'),
        //         response.message || localization.t('somethingWentWrong'),
        //     );
        // }

        setIsLoading(false);
    }, []);

    const onRefresh = useCallback(
        async (offset: number = OFFSET) => {
            await getList(offset);
        },
        [getList],
    );

    const onEndReached = useCallback(async () => {
        const list = wineListModel.list;
        if (!isLoading && list && list.meta.total > list.data.length) {
            await getList(list.data.length);
        }
    }, [isLoading, getList]);

    useEffect(() => {
        Promise.resolve().then(() => {
            onRefresh();
        });
    }, [onRefresh]);

    useEffect(() => {
        return () => wineListModel.clear();
    }, []);

    const handleItemPress = useCallback(() => {
        navigation.navigate('ScanResultView');
    },[navigation]);

    const handleAddWinePress = useCallback(() => {
        navigation.navigate('AddWineView');
    },[navigation]);

    return { data, isLoading, onRefresh, onEndReached, handleItemPress, handleAddWinePress };
};
