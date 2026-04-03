import { useCallback, useState } from 'react';

export const useDropdownButton = (onExpand?: () => void, onCollapse?: () => void) => {
    const [isOpened, setIsOpened] = useState(false);

    const onToggle = useCallback(() => {
        setIsOpened(prev => {
            const newValue = !prev;
            if (newValue && onExpand) {
                onExpand();
            } else if (!newValue && onCollapse) {
                onCollapse();
            }
            return newValue;
        });
    }, [onExpand, onCollapse]);

    return { isOpened, onToggle };
};
