import { useCallback, useMemo, useState } from 'react';
import { IPaymentsListItem } from '@/entities/payments/types/IPaymentsListItem';
import { IPaymentMethodOption } from '@/modules/event/types/IPaymentMethodOption';

interface IProps {
    value: number[];
    paymentMethods: IPaymentsListItem[];
    onChange: (value: number[]) => void;
    onOpenPaymentsPress: () => void;
    isDisabled?: boolean;
}

export const usePaymentMethodsModal = ({
    value,
    paymentMethods,
    onChange,
    onOpenPaymentsPress,
    isDisabled = false,
}: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draftIds, setDraftIds] = useState<number[]>(value);

    const onOpen = useCallback(() => {
        if (isDisabled) {
            return;
        }

        setDraftIds(value);
        setIsVisible(true);
    }, [isDisabled, value]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const createOnToggle = useCallback((id: number) => {
        return () => {
            setDraftIds(prev => {
                if (prev.includes(id)) {
                    return prev.filter(item => item !== id);
                }

                return [...prev, id];
            });
        };
    }, []);

    const options = useMemo<IPaymentMethodOption[]>(() => {
        return paymentMethods.map((item) => {
            return {
                id: item.id,
                name: item.name,
                isSelected: draftIds.includes(item.id),
                onPress: createOnToggle(item.id),
            };
        });
    }, [createOnToggle, draftIds, paymentMethods]);

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onChange(draftIds);
        });
    }, [draftIds, onChange]);

    const onOpenPayments = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onOpenPaymentsPress();
        });
    }, [onOpenPaymentsPress]);

    const selectedText = useMemo(() => {
        const selectedPaymentMethods = paymentMethods.filter(item => value.includes(item.id));
        const [firstPaymentMethod, secondPaymentMethod] = selectedPaymentMethods;

        if (!firstPaymentMethod) {
            return '';
        }

        if (!secondPaymentMethod) {
            return firstPaymentMethod.name;
        }

        if (selectedPaymentMethods.length === 2) {
            return `${firstPaymentMethod.name}, ${secondPaymentMethod.name}`;
        }

        return `${firstPaymentMethod.name}, ${secondPaymentMethod.name} +${selectedPaymentMethods.length - 2}`;
    }, [paymentMethods, value]);

    return useMemo(() => {
        return {
            isVisible,
            options,
            selectedText,
            onOpen,
            onClose,
            onConfirm,
            onOpenPayments,
        };
    }, [isVisible, onClose, onConfirm, onOpen, onOpenPayments, options, selectedText]);
};
