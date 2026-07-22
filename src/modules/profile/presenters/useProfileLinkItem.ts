import { useCallback } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

export const useProfileLinkItem = (url: string) => {
    const onPress = useCallback(() => {
        Clipboard.setString(url);
        toastService.showSuccess(localization.t('common.copiedToClipboard'));
    }, [url]);

    return { onPress };
};
