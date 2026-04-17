import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { useSearchClearButton } from './presenters/useSearchClearButton';

interface IProps {
    visible: boolean;
    onPress: () => void;
}

export const SearchClearButton = ({ visible, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onButtonPress } = useSearchClearButton({ onPress });

    if (!visible) {
        return null;
    }

    return (
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
            <CrossIcon width={12} height={12} color={colors.icon} />
        </TouchableOpacity>
    );
};
