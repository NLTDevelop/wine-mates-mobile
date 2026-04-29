import { paymentsModel } from '@/entities/payments/PaymentsModel';
import { paymentsService } from '@/entities/payments/PaymentsService';
import { IPaymentsListItem } from '@/entities/payments/types/IPaymentsListItem';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

interface IImageFile {
    uri: string;
    name: string;
    type: string;
}

export const useCreatePayment = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const params = route.params as { payment?: IPaymentsListItem } | undefined;
    const payment = params?.payment;
    const isEditing = !!payment;
    const initialName = payment?.name || '';
    const initialPaymentDetails = payment?.paymentDetails || '';
    const initialDescription = payment?.description || '';

    const [name, setName] = useState(initialName);
    const [paymentDetails, setPaymentDetails] = useState(initialPaymentDetails);
    const [description, setDescription] = useState(initialDescription);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<IImageFile | null>(null);
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [isQrCodeRemoved, setIsQrCodeRemoved] = useState(false);
    const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
    const hasInitialQrCode = !!payment?.qrCode;

    const onChangeName = useCallback((value: string) => {
        setName(value);
        setChangedFields(prev => {
            const next = new Set(prev);
            if (value.trim() !== initialName.trim()) {
                next.add('name');
            } else {
                next.delete('name');
            }
            return next;
        });
    }, [initialName]);

    const onChangePaymentDetails = useCallback((value: string) => {
        setPaymentDetails(value);
        setChangedFields(prev => {
            const next = new Set(prev);
            if (value.trim() !== initialPaymentDetails.trim()) {
                next.add('paymentDetails');
            } else {
                next.delete('paymentDetails');
            }
            return next;
        });
    }, [initialPaymentDetails]);

    const onChangeDescription = useCallback((value: string) => {
        setDescription(value);
        setChangedFields(prev => {
            const next = new Set(prev);
            if (value.trim() !== initialDescription.trim()) {
                next.add('description');
            } else {
                next.delete('description');
            }
            return next;
        });
    }, [initialDescription]);

    const onPickImagePress = useCallback(() => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 1 }, response => {
            if (response.didCancel || response.errorCode) {
                return;
            }

            const asset = response.assets?.[0];
            if (!asset?.uri) {
                return;
            }

            const normalizedUri = asset.uri.startsWith('file://') ? asset.uri : `file://${asset.uri}`;
            const uriName = normalizedUri.split('/').pop();

            setSelectedImage({
                uri: normalizedUri,
                name: asset.fileName || uriName || `payment-${Date.now()}.jpg`,
                type: asset.type || 'image/jpeg',
            });
            setIsImageChanged(true);
            setIsQrCodeRemoved(false);
        });
    }, []);

    const onRemoveImagePress = useCallback(() => {
        setSelectedImage(null);
        setIsImageChanged(true);
        setIsQrCodeRemoved(true);
    }, []);

    const isSaveDisabled = useMemo(() => {
        if (!name.trim() || !paymentDetails.trim() || isLoading) {
            return true;
        }

        if (isEditing) {
            return changedFields.size === 0 && !isImageChanged;
        }

        return false;
    }, [changedFields, isEditing, isImageChanged, isLoading, name, paymentDetails]);

    const onSavePress = useCallback(async () => {
        const trimmedName = name.trim();
        const trimmedPaymentDetails = paymentDetails.trim();
        const trimmedDescription = description.trim();

        if (!trimmedName || !trimmedPaymentDetails) {
            return;
        }

        try {
            setIsLoading(true);

            if (isEditing && payment) {
                const formData = new FormData();

                if (changedFields.has('name')) {
                    formData.append('name', trimmedName);
                }

                if (changedFields.has('paymentDetails')) {
                    formData.append('paymentDetails', trimmedPaymentDetails);
                }

                if (changedFields.has('description')) {
                    formData.append('description', trimmedDescription);
                }

                if (isImageChanged && selectedImage) {
                    formData.append('image', selectedImage as any);
                }

                if (isQrCodeRemoved && hasInitialQrCode) {
                    formData.append('removeQrCode', 'true');
                }

                const response = await paymentsService.update(payment.id, formData);

                if (response.isError) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    return;
                }

                const currentList = paymentsModel.list || [];
                paymentsModel.list = currentList.map(item => {
                    if (item.id !== payment.id) {
                        return item;
                    }

                    return {
                        ...item,
                        name: changedFields.has('name') ? trimmedName : item.name,
                        paymentDetails: changedFields.has('paymentDetails') ? trimmedPaymentDetails : item.paymentDetails,
                        description: changedFields.has('description') ? trimmedDescription : item.description,
                        qrCode: isImageChanged && !selectedImage ? null : item.qrCode,
                    };
                });
            } else {
                const formData = new FormData();
                formData.append('name', trimmedName);
                formData.append('paymentDetails', trimmedPaymentDetails);
                formData.append('description', trimmedDescription);
                formData.append('isVisible', 'false');

                if (selectedImage) {
                    formData.append('image', selectedImage as any);
                }

                const response = await paymentsService.create(formData);

                if (response.isError || !response.data) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    return;
                }

                paymentsModel.appened(response.data);
            }

            navigation.goBack();
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
            toastService.showError(localization.t('common.errorHappened'));
        } finally {
            setIsLoading(false);
        }
    }, [changedFields, description, hasInitialQrCode, isEditing, isImageChanged, isQrCodeRemoved, name, navigation, payment, paymentDetails, selectedImage]);

    return {
        isEditing,
        name,
        paymentDetails,
        description,
        selectedImageUri: isImageChanged
            ? selectedImage?.uri || null
            : selectedImage?.uri || payment?.qrCode?.smallUrl || null,
        isSaveDisabled,
        isLoading,
        onChangeName,
        onChangePaymentDetails,
        onChangeDescription,
        onPickImagePress,
        onRemoveImagePress,
        onSavePress,
    };
};
