import { useCallback, useMemo, useState } from 'react';
import { OnLoadEvent } from '@d11/react-native-fast-image';

export const useWinePurchaseCard = () => {
    const [logoAspectRatio, setLogoAspectRatio] = useState(1);

    const onLogoLoad = useCallback((event: OnLoadEvent) => {
        const { width, height } = event.nativeEvent;
        if (width > 0 && height > 0) {
            setLogoAspectRatio(width / height);
        }
    }, []);

    const logoAspectRatioStyle = useMemo(() => ({
        aspectRatio: logoAspectRatio,
    }), [logoAspectRatio]);

    return {
        logoAspectRatioStyle,
        onLogoLoad,
    };
};
