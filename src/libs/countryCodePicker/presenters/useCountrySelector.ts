import { ICountry } from '@/libs/countryCodePicker/types/ICountry';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useCountrySelector = (onChangeCountry: (country: ICountry) => void) => {
    const countryModalRef = useRef<BottomSheetModal>(null);
    const frameRef = useRef<number | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isOpened, setIsOpened] = useState(false);

    const onClose = useCallback(() => {
        countryModalRef.current?.dismiss();
    }, []);

    const onDismiss = useCallback(() => {
        setIsOpened(false);
        setIsMounted(false);
    }, []);

    const onPress = useCallback(() => {
        setIsMounted(true);
        setIsOpened(true);
    }, []);

    const onCountryPress = useCallback((country: ICountry) => {
        onChangeCountry(country);
        setIsOpened(false);
        countryModalRef.current?.dismiss();
    }, [onChangeCountry]);

    useEffect(() => {
        if (!isMounted || !isOpened) {
            return undefined;
        }

        frameRef.current = requestAnimationFrame(() => {
            countryModalRef.current?.present();
        });

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [isMounted, isOpened]);

    return { countryModalRef, onClose, onDismiss, onPress, isMounted, isOpened, onCountryPress };
};
