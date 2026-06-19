import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { SearchIcon } from '@assets/icons/SearchIcon';
import { getStyles } from './styles';
import { PickerButton } from '@/UIKit/PickerButton';

interface IProps {
    tastingTypeLabel: string;
    onOpenSearchModal: () => void;
    onOpenTastingTypeModal: () => void;
}

export const WineSetListHeader = ({
    tastingTypeLabel,
    onOpenSearchModal,
    onOpenTastingTypeModal,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.searchButton} onPress={onOpenSearchModal} activeOpacity={0.8}>
                <SearchIcon />
                <Typography variant="body_400" text={t('common.search')} style={styles.searchButtonText} />
            </TouchableOpacity>
            <View style={styles.tastingTypePickerContainer}>
                <PickerButton text={tastingTypeLabel} onPress={onOpenTastingTypeModal} />
            </View>
        </View>
    );
};
