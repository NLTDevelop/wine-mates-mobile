import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CopyIcon } from '@assets/icons/CopyIcon';
import { PencilIcon } from '@assets/icons/PencilIcon';
import { useTastingNote } from '@/modules/scanner/presenters/useTastingNote';
import { NoteLoader } from '../NoteLoader';
import { Button } from '@/UIKit/Button';
import { IRateContext } from '@/entities/wine/types/IRateContext';
import { CustomInput } from '@/UIKit/CustomInput';

interface IProps {
    note: string | null;
    isLoading: boolean;
    limits: IRateContext | null;
    onGeneratePress: () => void;
    onUpdateNote: (updatedNote: string) => void;
}

export const TastingNote = ({ note, isLoading, limits, onGeneratePress, onUpdateNote }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const hasNote = note !== null || limits?.note !== null;
    const displayNote = note ?? limits?.note ?? '';
    const { onCopyPress, isEditing, editedNote, setEditedNote, onEditPress, inputRef }
        = useTastingNote(displayNote, onUpdateNote);

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
            ) : hasNote ? (
                <View style={styles.noteContainer}>
                    <CustomInput
                        ref={inputRef}
                        style={styles.noteInput}
                        inputContainerStyle={styles.noteInputContainer}
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
                        <TouchableOpacity onPress={onEditPress} hitSlop={15}>
                            <PencilIcon width={24} height={24} color={isEditing ? colors.text_light : undefined} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}
        </View>
    );
};
