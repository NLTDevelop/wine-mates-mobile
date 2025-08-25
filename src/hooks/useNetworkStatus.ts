// import { useEffect, useRef } from 'react';
// import NetInfo from '@react-native-community/netinfo';
// import { useUiContext } from '../UIProvider';
// import { toastService } from '../libs/toast/toastService';
// import Toast from 'react-native-toast-message';

// export const useNetworkStatus = () => {
//     const { t } = useUiContext();
//     const isToastVisibleRef = useRef(false);

//     useEffect(() => {
//         const unsubscribe = NetInfo.addEventListener(state => {
//             if (!state.isConnected) {
//                 toastService.showWarning(t('networkError'), undefined, true);
//                 isToastVisibleRef.current = true;
//             } else {
//                 if (isToastVisibleRef.current) {
//                     Toast.hide();
//                     isToastVisibleRef.current = false;
//                 }
//             }
//         });

//         return () => unsubscribe();
//     }, [t]);
// };
