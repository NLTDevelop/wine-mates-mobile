import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';

export const useCountrySelector = () => {
    const countryModalRef = useRef<BottomSheetModal>(null);
    const [isOpened, setIsOpened] = useState(false);

    const handleClose = useCallback(() => {
        setIsOpened(false);
        countryModalRef.current?.dismiss();
    }, []);

    const handlePress = useCallback(() => {
        setIsOpened(true);
        countryModalRef.current?.present();
    }, []);

    const handleCountryPress = useCallback(() => {
        //TODO: add Country data
        console.log('Select!');
        setIsOpened(false);
        countryModalRef.current?.dismiss();
    }, []);

    return { countryModalRef, handleClose, handlePress, isOpened, handleCountryPress };
};
