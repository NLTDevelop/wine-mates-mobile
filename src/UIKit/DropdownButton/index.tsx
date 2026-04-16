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
    onExpand?: () => void;
    onCollapse?: () => void;
    onLongPress?: () => void;
}

export const DropdownButton = ({ title, children, onExpand, onCollapse, onLongPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { isOpened, onToggle } = useDropdownButton(onExpand, onCollapse);

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={onToggle} onLongPress={onLongPress}>
                <Typography variant="h6" text={title} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
            {isOpened && children}
        </View>
    );
};
