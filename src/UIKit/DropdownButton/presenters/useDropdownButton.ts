import { useCallback, useState } from 'react';

export const useDropdownButton = (onExpand?: () => void, onCollapse?: () => void) => {
    const [isOpened, setIsOpened] = useState(false);

    const onPress = useCallback(() => {
        setIsOpened(prevState => {
            const newState = !prevState;
            if (newState) {
                onExpand?.();
            } else {
                onCollapse?.();
            }
            return newState;
        });
    }, [onExpand, onCollapse]);

    return { isOpened, onPress };
};
