import { useEffect, useState } from 'react';

export const useTabBar = () => {
    const [showBlur, setShowBlur] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowBlur(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return { showBlur };
};
