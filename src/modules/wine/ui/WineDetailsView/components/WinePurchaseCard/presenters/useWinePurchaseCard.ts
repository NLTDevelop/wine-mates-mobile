import { useCallback, useMemo, useState } from 'react';
import { OnLoadEvent } from '@d11/react-native-fast-image';
import { PartnerStatus } from '@/entities/wine/enums/PartnerStatus';
import { IWinePurchaseCard } from '@/modules/wine/types/IWinePurchaseCard';

export const useWinePurchaseCard = (item: IWinePurchaseCard) => {
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
    const imageSource = item.imageUrl
        ? { uri: item.imageUrl }
        : item.status === PartnerStatus.BUSINESS_PARTNERS
            ? require('@assets/images/sellers.png')
            : null;

    return {
        logoAspectRatioStyle,
        onLogoLoad,
        imageSource,
    };
};
