import { useCallback, useRef, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { isIOS } from '@/utils';
import { TextInput } from 'react-native';

export const useTastingNote = (note: string | null, onChangeNote?: (updatedNote: string) => void) => {
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
        setIsEditing(prevState => {
            const nextState = !prevState;

            if (nextState) {
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            } else {
                inputRef.current?.blur();
            }

            return nextState;
        });
    }, []);

    const setEditedNote = useCallback((updatedNote: string) => {
        onChangeNote?.(updatedNote);
    }, [onChangeNote]);

    return { onCopyPress, isEditing, editedNote, setEditedNote, onEditPress, inputRef };
};
