import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { PlusIcon } from '../../../../../../assets/icons/PlusIcon';

interface IProps {
    onPress: () => void;
}

export const AddButton = ({onPress}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <PlusIcon />
        </TouchableOpacity>
    );
};
