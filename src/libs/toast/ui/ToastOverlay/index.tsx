import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { scaleVertical } from '../../../../utils';
import { toastConfig } from '../../ToastConfig';

export const ToastOverlay = () => {
    const insets = useSafeAreaInsets();

    return <Toast config={toastConfig} position="top" topOffset={insets.top + scaleVertical(16)} />;
};
