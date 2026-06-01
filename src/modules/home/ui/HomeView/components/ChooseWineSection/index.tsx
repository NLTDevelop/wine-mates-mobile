import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { PersonIcon } from '@assets/icons/PersonIcon';
import { PartyIcon } from '@assets/icons/PartyIcon';
import { getStyles } from './styles';
import { useChooseWineSection } from './presenters/useChooseWineSection';

interface IProps {
    title: string;
}

export const ChooseWineSection = ({ title }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onMyselfPress, onFriendPress } = useChooseWineSection();

    return (
        <View style={styles.container}>
            <Typography variant="h3" text={title} />
            <View style={styles.optionsRow}>
                <TouchableOpacity onPress={onMyselfPress} style={styles.option}>
                    <PersonIcon width={32} height={32} color={colors.text_light} />
                    <Typography variant="subtitle_16_700" text={t('home.chooseWineMyself')} style={styles.optionTitle} />
                    <Typography
                        variant="subtitle_12_500"
                        text={t('home.chooseWineMyselfDescription')}
                        style={styles.optionDescription}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={onFriendPress} style={styles.option}>
                    <PartyIcon width={32} height={32} />
                    <Typography variant="subtitle_16_700" text={t('home.chooseWineFriend')} style={styles.optionTitle} />
                    <Typography
                        variant="subtitle_12_500"
                        text={t('home.chooseWineFriendDescription')}
                        style={styles.optionDescription}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};
