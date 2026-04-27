import { useCallback, useMemo, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ILanguageOption } from '../../../types/ILanguageOption';
import { useLocalizedLanguageOptions } from '../../../presenters/useLocalizedLanguageOptions';

interface IProps {
    value: string;
    onChange: (value: string) => void;
}

export const useLanguageSelector = ({ value, onChange }: IProps) => {
    const modalRef = useRef<BottomSheetModal>(null);
    const [isOpened, setIsOpened] = useState(false);
    const { languageOptions } = useLocalizedLanguageOptions();

    const selectedLanguage = useMemo(() => {
        return languageOptions.find((item) => item.code === value.toLowerCase()) || null;
    }, [languageOptions, value]);

    const onOpen = useCallback(() => {
        setIsOpened(true);
        modalRef.current?.present();
    }, []);

    const onClose = useCallback(() => {
        setIsOpened(false);
        modalRef.current?.dismiss();
    }, []);

    const onSelect = useCallback(
        (item: ILanguageOption) => {
            onChange(item.code);
            setIsOpened(false);
            modalRef.current?.dismiss();
        },
        [onChange],
    );

    return {
        modalRef,
        selectedLanguage,
        isOpened,
        onOpen,
        onClose,
        onSelect,
    };
};
