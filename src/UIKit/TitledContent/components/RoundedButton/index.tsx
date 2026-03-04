import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ArrowRightIcon } from '@assets/icons/ArrowRightIcon.tsx';
import { useUiContext } from '@/UIProvider';
import { useMemo } from 'react';
import { getStyles } from './styles.ts';

interface IProps extends TouchableOpacityProps {

}

export const RoundedButton = (props: IProps) => {

    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return <TouchableOpacity style={styles.container} activeOpacity={0.7} {...props}>
        <ArrowRightIcon />
    </TouchableOpacity>
}
