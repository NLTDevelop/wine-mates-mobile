import { userModel } from '@/entities/users/UserModel';
import { useCallback, useEffect, useState } from 'react';

let lastScreenIndex = 0;

interface IParams {
    routes: { key: string; title: string }[];
}

export const useWineAndStylesTabs = ({ routes }: IParams) => {
    const [screenIndex, setScreenIndex] = useState(lastScreenIndex);
    const hasPremium = userModel.user?.hasPremium || false;

    const onIndexChange = useCallback(
        (index: number) => {
            const isTasteProfileTab = routes[index]?.key === 'muTasteProfile';
            if (isTasteProfileTab && !hasPremium) {
                return;
            }
            setScreenIndex(index);
            lastScreenIndex = index;
        },
        [routes, hasPremium],
    );

    useEffect(() => {
        return () => {
            lastScreenIndex = 0;
        };
    }, []);

    return { screenIndex, onIndexChange, hasPremium };
};
