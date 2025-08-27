import Toast, { ToastShowParams } from 'react-native-toast-message';

class ToastService {

    showSuccess(text1?: string, params: ToastShowParams = {}) {
        Toast.show({
            type: 'success',
            text1,
            text2: undefined,
            topOffset: 60,
            ...params,
        });
    }

    showError(text1?: string, text2?: string, persist = false) {
        Toast.show({
            type: 'error',
            text1,
            text2,
            topOffset: 60,
            autoHide: !persist,
        });
    }

    showInfo(text1?: string, text2?: string) {
        Toast.show({
            type: 'info',
            text1,
            text2,
            topOffset: 60,
        });
    }

    showWarning(text1?: string, text2?: string, persist = false) {
        Toast.show({
            type: 'warning',
            text1,
            text2,
            topOffset: 60,
            autoHide: !persist,
        });
    }

}

export const toastService = new ToastService();