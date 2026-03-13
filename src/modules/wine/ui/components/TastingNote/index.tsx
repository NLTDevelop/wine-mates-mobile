import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CopyIcon } from '@assets/icons/CopyIcon';
import { useTastingNote } from '@/modules/scanner/presenters/useTastingNote';

interface IProps {
    note: string;
}

export const TastingNote = ({ note }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { onCopyPress } = useTastingNote(note);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography variant="subtitle_20_500" text={t('wine.tastingNotes')} />
            </View>
            <View style={styles.noteContainer}>
                <Typography text={note} variant="h6" />
                <TouchableOpacity onPress={onCopyPress} hitSlop={15} style={styles.button}>
                    <CopyIcon />
                </TouchableOpacity>
            </View>
        </View>
    );
};
