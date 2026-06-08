import { useCallback } from 'react';

export const useChooseWineSection = () => {
    const onMyselfPress = useCallback(() => {}, []);

    const onFriendPress = useCallback(() => {}, []);

    return {
        onMyselfPress,
        onFriendPress,
    };
};
