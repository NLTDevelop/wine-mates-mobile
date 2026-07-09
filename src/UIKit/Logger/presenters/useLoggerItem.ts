import { useCallback, useState } from 'react';

export const useLoggerItem = () => {
    const [show, setShow] = useState(false);

    const onShow = useCallback(() => {
        setShow(prev => !prev);
    }, []);

    return { show, onShow };
};
