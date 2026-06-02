import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useChooseWineSection } from './presenters/useChooseWineSection';
import { UserIcon } from '@assets/icons/UserIcon';
import { PeopleIcon } from '@assets/icons/PeopleIcon';

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
                    <UserIcon/>
                    <Typography variant="subtitle_16_700" text={t('home.chooseWineMyself')} style={styles.optionTitle} />
                    <Typography
                        variant="subtitle_12_500"
                        text={t('home.chooseWineMyselfDescription')}
                        style={styles.optionDescription}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={onFriendPress} style={styles.option}>
                    <PeopleIcon/>
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
