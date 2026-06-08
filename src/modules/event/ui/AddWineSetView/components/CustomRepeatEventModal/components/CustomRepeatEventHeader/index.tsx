import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';

interface IProps {
    onClose: () => void;
}

const CustomRepeatEventHeaderComponent = ({ onClose }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography text={t('repeatEvent.title')} variant="subtitle_20_500" style={styles.title} />
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <CrossIcon color={colors.text} />
            </TouchableOpacity>
        </View>
    );
};

export const CustomRepeatEventHeader = memo(CustomRepeatEventHeaderComponent);
