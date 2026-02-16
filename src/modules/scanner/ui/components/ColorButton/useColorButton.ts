import { useMemo } from 'react';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';

interface IProps {
    color: IWineColorShade;
}

export const useColorButton = ({ color }: IProps) => {
    const isRedColor = useMemo(() => {
        const hex = color.colorHex.toLowerCase().replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        const brightness = (r + g + b) / 3;
        const isDark = brightness < 120;
        
        return isDark && (r >= g || r >= b);
    }, [color.colorHex]);

    return { isRedColor };
};
