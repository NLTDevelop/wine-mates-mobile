import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

export const useWineCarouselCard = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return {
        styles,
    };
};
