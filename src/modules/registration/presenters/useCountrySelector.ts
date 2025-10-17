import { ICountry } from '@/libs/countryCodePicker/types/ICountry';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';

export const useCountrySelector = (onChangeCountry: (country: ICountry) => void) => {
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

    const handleCountryPress = useCallback((country: ICountry) => {
        onChangeCountry(country);
        setIsOpened(false);
        countryModalRef.current?.dismiss();
    }, [onChangeCountry]);

    return { countryModalRef, handleClose, handlePress, isOpened, handleCountryPress };
};
