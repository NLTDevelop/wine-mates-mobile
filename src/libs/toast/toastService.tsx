import Toast from 'react-native-toast-message';

class ToastService {
    showSuccess(text1?: string, text2?: string) {
        Toast.show({
            type: 'success',
            text1: text1 || '',
            text2,
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
        });
    }
    showError(text1?: string, text2?: string) {
        Toast.show({
            type: 'error',
            text1: text1 || '',
            text2,
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
        });
    }
    showInfo(text1?: string, text2?: string) {
        Toast.show({
            type: 'info',
            text1: text1 || '',
            text2,
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
        });
    }
    showWarning(text1?: string, text2?: string) {
        Toast.show({
            type: 'warning',
            text1: text1 || '',
            text2,
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
        });
    }
}

export const toastService = new ToastService();
