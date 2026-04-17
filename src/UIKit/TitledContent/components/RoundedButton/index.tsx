import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ArrowRightIcon } from '@assets/icons/ArrowRightIcon.tsx';
import { useUiContext } from '@/UIProvider';
import { useMemo } from 'react';
import { getStyles } from './styles.ts';
import { ArrowIcon } from '@assets/icons/ArrowIcon.tsx';

interface IProps extends TouchableOpacityProps {
    isArrowLeft?: boolean;
}

export const RoundedButton = (props: IProps) => {

    const {isArrowLeft = false} = props;

    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return <TouchableOpacity style={styles.container} activeOpacity={0.7} {...props}>
        {isArrowLeft ? <ArrowIcon /> : <ArrowRightIcon />}
    </TouchableOpacity>
}
