import { ReactElement, useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { useDropdownButton } from './presenters/useDropdownButton';

interface IProps {
    children: ReactElement;
    title: string;
}

export const DropdownButton = ({ title, children }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { isOpened, onPress } = useDropdownButton();

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Typography variant="h6" text={title} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>

            {isOpened && children}
        </View>
    );
};
