import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ILanguageOption } from '../../../types/ILanguageOption';
import { useLocalizedLanguageOptions } from '../../../presenters/useLocalizedLanguageOptions';

interface IProps {
    value: string;
    onChange: (value: string) => void;
}

export const useLanguageSelector = ({ value, onChange }: IProps) => {
    const modalRef = useRef<BottomSheetModal>(null);
    const pendingLanguageCodeRef = useRef<string | null>(null);
    const frameRef = useRef<number | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const { languageOptions } = useLocalizedLanguageOptions();

    const selectedLanguage = useMemo(() => {
        return languageOptions.find((item) => item.code === value.toLowerCase()) || null;
    }, [languageOptions, value]);

    const onOpen = useCallback(() => {
        Keyboard.dismiss();
        setIsMounted(true);
        setIsOpened(true);
    }, []);

    const onClose = useCallback(() => {
        modalRef.current?.dismiss();
    }, []);

    const onDismiss = useCallback(() => {
        setIsOpened(false);
        setIsMounted(false);
        const pendingLanguageCode = pendingLanguageCodeRef.current;

        if (pendingLanguageCode) {
            pendingLanguageCodeRef.current = null;
            onChange(pendingLanguageCode);
        }
    }, [onChange]);

    const onSelect = useCallback(
        (item: ILanguageOption) => {
            pendingLanguageCodeRef.current = item.code;
            modalRef.current?.dismiss();
        },
        [],
    );

    useEffect(() => {
        if (!isMounted || !isOpened) {
            return undefined;
        }

        frameRef.current = requestAnimationFrame(() => {
            modalRef.current?.present();
        });

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [isMounted, isOpened]);

    return {
        modalRef,
        selectedLanguage,
        isMounted,
        isOpened,
        onOpen,
        onClose,
        onDismiss,
        onSelect,
    };
};
