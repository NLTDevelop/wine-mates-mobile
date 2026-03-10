import { useCallback, useEffect, useRef, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { isIOS } from '@/utils';
import { TextInput } from 'react-native';

export const useTastingNote = (note: string | null) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedNote, setEditedNote] = useState(note || '');
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (note) {
            setEditedNote(note);
        }
    }, [note]);

    const onCopyPress = useCallback(() => {
        if (!editedNote) {
            return;
        }

        Clipboard.setString(editedNote);
        
        if (isIOS) {
            toastService.showSuccess(localization.t('common.copiedToClipboard'));
        }
    }, [editedNote]);

    const onEditPress = useCallback(() => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }, []);

    const onConfirmEdit = useCallback(() => {
        setIsEditing(false);
    }, []);

    return { onCopyPress, isEditing, editedNote, setEditedNote, onEditPress, onConfirmEdit, inputRef };
};
