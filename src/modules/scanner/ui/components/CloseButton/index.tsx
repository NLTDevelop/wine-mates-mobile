import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { CrossIcon } from '@/assets/icons/CrossIcon';

interface IProps {
    onPress: () => void;
}

export const CloseButton = ({ onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <CrossIcon width={20} height={20} />
        </TouchableOpacity>
    );
};
