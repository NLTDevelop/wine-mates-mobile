import { ConfirmationAlert } from '@/UIKit/ConfirmationAlert';

interface IProps {
    isVisible: boolean;
    title: string;
    description: string;
    confirmButtonText: string;
    onClose: () => void;
    onOpenSettings: () => void;
}

export const PermissionGuardModal = ({
    isVisible,
    title,
    description,
    confirmButtonText,
    onClose,
    onOpenSettings,
}: IProps) => {
    if (!isVisible) {
        return null;
    }

    return (
        <ConfirmationAlert
            visible={isVisible}
            onClose={onClose}
            onConfirm={onOpenSettings}
            title={title}
            description={description}
            buttonText={confirmButtonText}
        />
    );
};
