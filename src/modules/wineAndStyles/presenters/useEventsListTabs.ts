import { useCallback, useEffect, useState } from 'react';

let lastScreenIndex = 0;

export const useWineAndStylesTabs = () => {
    const [screenIndex, setScreenIndex] = useState(lastScreenIndex);

    const handleIndexChange = useCallback((index: number) => {
        setScreenIndex(index);
        lastScreenIndex = index;
    }, []);

    useEffect(() => {
        return () => {
            lastScreenIndex = 0;
        };
    }, []);

    return { screenIndex, handleIndexChange };
};
