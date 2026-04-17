import { useCallback, useRef, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { isIOS } from '@/utils';
import { TextInput } from 'react-native';

interface IUseTastingNoteParams {
    onGeneratePress?: () => void;
    onEditingChange?: (isEditing: boolean) => void;
    onInvalidEditComplete?: () => void;
}

export const useTastingNote = (
    note: string | null,
    onChangeNote?: (updatedNote: string) => void,
    params?: IUseTastingNoteParams,
) => {
    const { onGeneratePress: onGenerate, onEditingChange, onInvalidEditComplete } = params || {};
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const editedNote = note || '';

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
        if (isEditing && !editedNote.trim()) {
            onInvalidEditComplete?.();
            return;
        }

        setIsEditing(prevState => {
            const nextState = !prevState;

            if (nextState) {
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            } else {
                inputRef.current?.blur();
            }

            onEditingChange?.(nextState);
            return nextState;
        });
    }, [editedNote, isEditing, onEditingChange, onInvalidEditComplete]);

    const setEditedNote = useCallback((updatedNote: string) => {
        onChangeNote?.(updatedNote);
    }, [onChangeNote]);

    const onGeneratePress = useCallback(() => {
        if (isEditing) {
            setIsEditing(false);
            inputRef.current?.blur();
            onEditingChange?.(false);
        }

        onGenerate?.();
    }, [isEditing, onEditingChange, onGenerate]);

    return { onCopyPress, isEditing, editedNote, setEditedNote, onEditPress, onGeneratePress, inputRef };
};
