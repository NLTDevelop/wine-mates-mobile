import { useCallback, useState } from 'react';

interface IUseWineEventListItemProps {
    eventId: number;
    onReadMorePress?: (eventId: number) => void;
    onFavoritePress?: (eventId: number) => void;
}

export const useWineEventListItem = ({
    eventId,
    onReadMorePress,
    onFavoritePress
}: IUseWineEventListItemProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleReadMorePress = useCallback(() => {
        setIsModalVisible(true);
        onReadMorePress?.(eventId);
    }, [eventId, onReadMorePress]);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleFavoritePress = useCallback(() => {
        onFavoritePress?.(eventId);
    }, [eventId, onFavoritePress]);

    return {
        isModalVisible,
        handleReadMorePress,
        handleCloseModal,
        handleFavoritePress,
    };
};
