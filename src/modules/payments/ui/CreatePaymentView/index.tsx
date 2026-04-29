import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { useCreatePayment } from './presenters/useCreatePayment';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { Image, TouchableOpacity, View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { AddMediaIcon } from '@assets/icons/AddMediaIcon';
import { CrossIcon } from '@assets/icons/CrossIcon';

export const CreatePaymentView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        name,
        paymentDetails,
        description,
        selectedImageUri,
        isSaveDisabled,
        isLoading,
        onChangeName,
        onChangePaymentDetails,
        onChangeDescription,
        onPickImagePress,
        onRemoveImagePress,
        onSavePress,
    } = useCreatePayment();

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            scrollEnabled
            isKeyboardAvoiding
            headerComponent={<HeaderWithBackButton title={t('payments.paymentsMethods')} isCentered />}
        >
            <View style={styles.container}>
                <CustomInput
                    value={name}
                    onChangeText={onChangeName}
                    placeholder={t('payments.name')}
                    containerStyle={styles.inputContainer}
                />

                <CustomInput
                    value={paymentDetails}
                    onChangeText={onChangePaymentDetails}
                    placeholder={t('payments.paymentDetails')}
                    containerStyle={styles.inputContainer}
                />

                <CustomInput
                    value={description}
                    onChangeText={onChangeDescription}
                    placeholder={t('payments.description')}
                    multiline
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.descriptionInputContainer}
                />

                {!!selectedImageUri && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: selectedImageUri }} style={styles.image} />
                        <TouchableOpacity style={styles.removeImageButton} onPress={onRemoveImagePress}>
                            <CrossIcon width={14} height={14} color={colors.background} />
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity onPress={onPickImagePress} style={styles.uploadContainer}>
                    <AddMediaIcon color={colors.primary} />
                    <Typography text={t('payments.downloadFile')} variant="h6" style={styles.uploadTitle} />
                </TouchableOpacity>

                <Typography text={t('payments.downloadHint')} variant="body_400" style={styles.uploadSubtitle} />

                <Button
                    text={t('common.save')}
                    onPress={onSavePress}
                    inProgress={isLoading}
                    disabled={isSaveDisabled}
                    containerStyle={styles.saveButton}
                />
            </View>
        </ScreenContainer>
    );
};
