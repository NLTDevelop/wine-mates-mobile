import { useCallback } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

export const useTastingNote = (note: string | null) => {
    const onCopyPress = useCallback(() => {
        if (!note) {
            return;
        }

        Clipboard.setString(note);
    }, [note]);

    return { onCopyPress };
};
