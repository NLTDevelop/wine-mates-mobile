import { useRef } from 'react';

export const useSelectablePressGuard = () => {
    const blockPress = useRef(false);

    return {
        bindPressable: {
            onPress: (callback: () => void) => {
                if (!blockPress.current) {
                    callback();
                }
            },
            onPressOut: () => {
                blockPress.current = false;
            },
        },

        bindText: {
            selectable: true,
            suppressHighlighting: true,
            onLongPress: () => {
                blockPress.current = true;
            },
            onPress: () => {
                blockPress.current = false;
            },
        },
    };
};
