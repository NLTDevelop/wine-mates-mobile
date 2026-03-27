import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Keyboard, View } from 'react-native';
import { isIOS, scaleVertical } from '@/utils';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';

const DROPDOWN_MAX_HEIGHT = scaleVertical(250);
const KEYBOARD_SPACING = isIOS ? scaleVertical(16) : scaleVertical(32);

export const useDropdownLiftOffset = (isOpen: boolean) => {
    const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
    const [triggerBottom, setTriggerBottom] = useState(0);
    const [keyboardTop, setKeyboardTop] = useState<number | null>(null);
    const keyboardHeight = useKeyboardHeight();
    const triggerContainerRef = useRef<View>(null);

    useEffect(() => {
        const keyboardDidShowSubscription = Keyboard.addListener('keyboardDidShow', event => {
            setKeyboardTop(event.endCoordinates.screenY);
        });
        const keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardTop(null);
        });
        const dimensionChangeSubscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowHeight(window.height);
        });

        return () => {
            keyboardDidShowSubscription.remove();
            keyboardDidHideSubscription.remove();
            dimensionChangeSubscription.remove();
        };
    }, []);

    const onMeasureTrigger = useCallback((onMeasured?: () => void) => {
        triggerContainerRef.current?.measureInWindow((_x, y, _width, height) => {
            setTriggerBottom(y + height);
            onMeasured?.();
        });
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        onMeasureTrigger();
    }, [isOpen, keyboardTop, keyboardHeight, windowHeight, onMeasureTrigger]);

    const effectiveKeyboardTop = useMemo(() => {
        const topByScreenY = keyboardTop;
        const topByHeight = keyboardHeight > 0 ? windowHeight - keyboardHeight : null;

        if (topByScreenY !== null && topByHeight !== null) {
            return Math.min(topByScreenY, topByHeight);
        }

        if (topByScreenY !== null) {
            return topByScreenY;
        }

        if (topByHeight !== null) {
            return topByHeight;
        }

        return null;
    }, [keyboardTop, keyboardHeight, windowHeight]);

    const dropdownLiftOffset = useMemo(() => {
        if (!isOpen || effectiveKeyboardTop === null || triggerBottom <= 0) {
            return 0;
        }

        const allowedDropdownBottom = effectiveKeyboardTop - KEYBOARD_SPACING;
        const expectedDropdownBottom = triggerBottom + DROPDOWN_MAX_HEIGHT;
        const overlap = expectedDropdownBottom - allowedDropdownBottom;

        return overlap > 0 ? overlap : 0;
    }, [isOpen, effectiveKeyboardTop, triggerBottom]);

    return {
        triggerContainerRef,
        dropdownLiftOffset,
        onMeasureTrigger,
    };
};
