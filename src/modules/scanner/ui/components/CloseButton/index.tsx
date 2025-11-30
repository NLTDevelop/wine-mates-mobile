import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { CrossIcon } from '../../../../../../assets/icons/CrossIcon';
import { useCloseButton } from '@/modules/scanner/presenters/useCloseButton';

export const CloseButton = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { onPress } = useCloseButton();

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <CrossIcon width={20} height={20} />
        </TouchableOpacity>
    );
};
