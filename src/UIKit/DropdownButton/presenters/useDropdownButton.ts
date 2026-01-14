import { useCallback, useState } from 'react';

export const useDropdownButton = () => {
    const [isOpened, setIsOpened] = useState(false);

    const onPress = useCallback(() => {
        setIsOpened(prevState => !prevState);
    }, []);

    return { isOpened, onPress };
};
