import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CopyIcon } from '@assets/icons/CopyIcon';
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

    const { onCopyPress } = useTastingNote(note);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Typography variant="subtitle_20_500" text={t('wine.tastingNotes')} />
                </View>
                <Button
                    text={t('common.generate')}
                    onPress={ onGeneratePress}
                    containerStyle={styles.button}
                    disabled={isLoading || !limits || limits?.aiUsage.left === 0}
                />
            </View>
            {isLoading ? (
                <NoteLoader />
            ) : note ? (
                <View style={styles.noteContainer}>
                    <Typography variant="h6" text={note} />
                    <TouchableOpacity style={styles.copyButton} onPress={onCopyPress} hitSlop={15}>
                        <CopyIcon />
                    </TouchableOpacity>
                </View>
            ) : limits?.note ? (
                <View style={styles.noteContainer}>
                    <Typography variant="h6" text={limits.note} />
                    <TouchableOpacity style={styles.copyButton} onPress={onCopyPress} hitSlop={15}>
                        <CopyIcon />
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
};
