import { useCallback } from 'react';
import { TastingType } from '@/entities/events/enums/TastingType';

interface IUseMapMarkerProps {
    eventId: number;
    tastingType: TastingType;
    onPress?: (id: number) => void;
}

export const useMapMarker = ({ eventId, tastingType, onPress }: IUseMapMarkerProps) => {
    const onPressHandler = useCallback(() => {
        onPress?.(eventId);
    }, [eventId, onPress]);

    const emoji = tastingType === TastingType.Parties ? '🥂' : '🍷';

    return {
        onPressHandler,
        emoji,
    };
};
