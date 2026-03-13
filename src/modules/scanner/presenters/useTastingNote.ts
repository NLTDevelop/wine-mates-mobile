import { useCallback, useRef, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { isIOS } from '@/utils';
import { TextInput } from 'react-native';

export const useTastingNote = (note: string | null, onUpdateNote: (updatedNote: string) => Promise<boolean>) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftNote, setDraftNote] = useState('');
    const inputRef = useRef<TextInput>(null);
    const editedNote = isEditing ? draftNote : note || '';

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
        setDraftNote(note || '');
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }, [note]);

    const onConfirmEdit = useCallback(async () => {
        const nextNote = draftNote.trim();
        const currentNote = (note || '').trim();

        if (!nextNote || nextNote === currentNote) {
            setIsEditing(false);
            return;
        }

        const isUpdated = await onUpdateNote(nextNote);

        if (isUpdated) {
            setIsEditing(false);
        }
    }, [draftNote, note, onUpdateNote]);

    return { onCopyPress, isEditing, editedNote, setEditedNote: setDraftNote, onEditPress, onConfirmEdit, inputRef };
};
