import { useMemo } from 'react';
import { TouchableOpacity, View, TextInput } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CopyIcon } from '@assets/icons/CopyIcon';
import { PencilIcon } from '@assets/icons/PencilIcon';
import { CheckIcon } from '@assets/icons/CheckIcon';
import { useTastingNote } from '@/modules/scanner/presenters/useTastingNote';
import { NoteLoader } from '../NoteLoader';
import { Button } from '@/UIKit/Button';
import { IRateContext } from '@/entities/wine/types/IRateContext';

interface IProps {
    note: string | null;
    isLoading: boolean;
    limits: IRateContext | null;
    onGeneratePress: () => void;
}

export const TastingNote = ({ note, isLoading, limits, onGeneratePress }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { onCopyPress, isEditing, editedNote, setEditedNote, onEditPress, onConfirmEdit, inputRef } = useTastingNote(note);
    const displayNote = note || limits?.note;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Typography variant="subtitle_20_500" text={t('wine.tastingNotes')} />
                </View>
                <Button
                    text={t('common.generate')}
                    onPress={onGeneratePress}
                    containerStyle={styles.button}
                    disabled={isLoading || !limits || limits?.aiUsage.left === 0}
                />
            </View>
            {isLoading ? (
                <NoteLoader />
            ) : displayNote ? (
                <View style={styles.noteContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.noteInput}
                        value={editedNote}
                        onChangeText={setEditedNote}
                        editable={isEditing}
                        multiline
                        scrollEnabled={false}
                    />
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity onPress={onCopyPress} hitSlop={15}>
                            <CopyIcon />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={isEditing ? onConfirmEdit : onEditPress}
                            hitSlop={15}
                        >
                            {isEditing ? <CheckIcon width={24} height={24} /> : <PencilIcon width={24} height={24} />}
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}
        </View>
    );
};
