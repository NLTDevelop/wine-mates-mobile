import { ErrorIcon } from '@assets/icons/ErrorIcon';
import { InfoIcon } from '@assets/icons/InfoIcon';
import { SuccessIcon } from '@assets/icons/SuccessIcon';
import { CustomToast, ToastTypesEnum } from './ui/CustomToast';
import { ToastErrorIcon } from '@assets/icons/ToastErrorIcon';

export const toastConfig = {
    success: (props: any) => (
        <CustomToast
            text1={props.text1 || ''}
            text2={props.text2}
            Icon={<SuccessIcon />}
            type={ToastTypesEnum.success}
        />
    ),
    error: (props: any) => (
        <CustomToast text1={props.text1 || ''} text2={props.text2} Icon={<ToastErrorIcon />} type={ToastTypesEnum.error} />
    ),
    info: (props: any) => (
        <CustomToast text1={props.text1 || ''} text2={props.text2} Icon={<InfoIcon />} type={ToastTypesEnum.info} />
    ),
    warning: (props: any) => (
        <CustomToast text1={props.text1 || ''} text2={props.text2} Icon={<ErrorIcon />} type={ToastTypesEnum.warning} />
    ),
};
