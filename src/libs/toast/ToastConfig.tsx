import { CustomToast, ToastTypesEnum } from './ui/CustomToast';
import { SuccessIcon } from '../../assets/icons/common/SuccessIcon';
import { ErrorIcon } from '../../assets/icons/common/ErrorIcon';
import { InfoIcon } from '../../assets/icons/common/InfoIcon';

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
        <CustomToast text1={props.text1 || ''} text2={props.text2} Icon={<ErrorIcon />} type={ToastTypesEnum.error} />
    ),
    info: (props: any) => (
        <CustomToast text1={props.text1 || ''} text2={props.text2} Icon={<InfoIcon />} type={ToastTypesEnum.info} />
    ),
    warning: (props: any) => (
        <CustomToast text1={props.text1 || ''} text2={props.text2} Icon={<ErrorIcon />} type={ToastTypesEnum.warning} />
    ),
};
