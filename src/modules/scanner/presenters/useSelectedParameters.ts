import { useState } from 'react';

export const useSelectedParameters = () => {
    const [isOpened, setIsOpened] = useState(false);

    const onPress = () => {
        setIsOpened(prevState => !prevState);
    };

    return { isOpened, onPress };
};
