import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Flag from 'react-native-round-flags';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ILanguageOption } from '../../types/ILanguageOption';
import { getStyles } from './styles';
import { useLanguageListItem } from './presenters/useLanguageListItem';

interface IProps {
    item: ILanguageOption;
    onPress: (item: ILanguageOption) => void;
}

export const LanguageListItem = memo(({ item, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onItemPress } = useLanguageListItem({ item, onPress });
    const firstLetter = item.name?.[0]?.toUpperCase() || '?';

    const renderFlag = () => {
        try {
            return <Flag code={item.countryCode} style={styles.flag} />;
        } catch {
            return (
                <View style={styles.placeholderFlag}>
                    <Typography variant="h6" text={firstLetter} style={styles.placeholderText} />
                </View>
            );
        }
    };

    return (
        <TouchableOpacity onPress={onItemPress} style={styles.container}>
            <View style={styles.leftContent}>
                {renderFlag()}
                <Typography variant="h5" text={item.name} style={styles.name} />
            </View>
            <Typography variant="h6" text={item.code} style={styles.code} />
        </TouchableOpacity>
    );
});

LanguageListItem.displayName = 'LanguageListItem';
