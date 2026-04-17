import { ReactElement, useMemo, useCallback, useState } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';

interface IProps {
    children: ReactElement;
    title: string;
    onExpand?: () => void;
    onCollapse?: () => void;
    onLongPress?: () => void;
}

export const FavoriteListDropdown = ({ title, children, onExpand, onCollapse, onLongPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [isOpened, setIsOpened] = useState(false);

    const onToggle = useCallback(() => {
        setIsOpened(prev => {
            const newValue = !prev;
            if (newValue && onExpand) {
                onExpand();
            } else if (!newValue && onCollapse) {
                onCollapse();
            }
            return newValue;
        });
    }, [onExpand, onCollapse]);

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
