import { useCallback } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { isIOS } from '@/utils';

export const useTastingNote = (note) => {
    const onCopyPress = useCallback(() => {
        if (!note) {
            return;
        }

        Clipboard.setString(note);
        
        if (isIOS) {
            toastService.showSuccess(localization.t('common.copiedToClipboard'));
        }
    }, [note]);

  
    return { onCopyPress };
};
