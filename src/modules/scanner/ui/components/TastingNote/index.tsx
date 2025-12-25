import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CopyIcon } from '@assets/icons/CopyIcon';
import { Loader } from '@/UIKit/Loader';
import { useTastingNote } from '@/modules/scanner/presenters/useTastingNote';
import { declOfWord } from '@/utils';

interface IProps {
    note: string | null;
    isLoading: boolean;
}

export const TastingNote = ({ note, isLoading }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { onCopyPress } = useTastingNote(note);
    const notesLeftText = declOfWord(10, t('wine.notesLeft') as unknown as Array<string>);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.row}>
                    <Typography variant="subtitle_20_500" text={t('wine.tastingNotes')} />
                    <TouchableOpacity onPress={onCopyPress} hitSlop={15}>
                        <CopyIcon />
                    </TouchableOpacity>
                </View>
                <Typography variant="body_500" text={notesLeftText} style={styles.text}/>
            </View>
            {isLoading ? (
                <Loader />
            ) : note ? (
                <View style={styles.noteContainer}>
                    <Typography variant="h6" text={note} />
                </View>
            ) : null}
        </View>
    );
};
