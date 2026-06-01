import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Button } from '@/UIKit/Button';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { CheckIcon } from '@assets/icons/CheckIcon';
import { CommentIcon } from '@assets/icons/CommentIcon';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { IHomeSectionOption } from '../../types/IHomeSectionOption';
import { getStyles } from './styles';

interface IProps {
    isVisible: boolean;
    items: IHomeSectionOption[];
    onClose: () => void;
    onSave: () => void;
    isSaving?: boolean;
}

export const HomeSectionsBottomSheet = ({ isVisible, items, onClose, onSave, isSaving }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const eventsItem = items[0];
    const chooseWineItem = items[1];
    const peopleTalkingItem = items[2];

    return (
        <BottomModal visible={isVisible} onClose={onClose} title={t('common.save')}>
            <View style={styles.container}>
                <HomeSectionOptionItem item={eventsItem} />
                <HomeSectionOptionItem item={chooseWineItem} />
                <HomeSectionOptionItem item={peopleTalkingItem} />
                <Button
                    type="main"
                    text={t('common.choose')}
                    onPress={onSave}
                    inProgress={isSaving}
                    disabled={isSaving}
                    containerStyle={styles.button}
                />
            </View>
        </BottomModal>
    );
};

const HomeSectionOptionItem = ({ item }: { item: IHomeSectionOption }) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity activeOpacity={0.85} onPress={item.onPress} style={styles.item}>
            <View style={styles.iconContainer}>
                <CommentIcon width={20} height={20} color={colors.text_light} />
            </View>
            <View style={styles.textContainer}>
                <Typography variant="h6" text={item.title} style={styles.title} />
                <Typography variant="subtitle_12_400" text={item.description} style={styles.description} />
            </View>
            <View style={item.isSelected ? styles.selectedAction : styles.unselectedAction}>
                {item.isSelected ? (
                    <CheckIcon width={24} height={24} color={colors.text_inverted} />
                ) : (
                    <PlusIcon width={24} height={24} color={colors.primary} />
                )}
            </View>
        </TouchableOpacity>
    );
};
