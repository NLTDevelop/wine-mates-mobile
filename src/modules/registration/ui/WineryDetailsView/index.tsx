import { useMemo } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { CustomInput } from '@/UIKit/CustomInput';
import { Button } from '@/UIKit/Button';
import { PickerButton } from '@/UIKit/PickerButton';
import { UniversalPickerBottomModal } from '@/UIKit/UniversalPickerBottomModal';
import { Warning } from '@/modules/authentication/ui/components/Warning';
import { CountrySelector } from '@/libs/countryCodePicker/components/CountrySelector';
import { SignInFooter } from '../components/SignInFooter';
import { useWineryDetails } from '../../presenters/useWineryDetails';
import { useWineryRegionModal } from './presenters/useWineryRegionModal';
import { getStyles } from './styles';
import { EditableRegistrationLinks } from '../components/EditableRegistrationLinks';

export const WineryDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        form,
        countries,
        regions,
        isLoading,
        isError,
        isDisabled,
        onChangeName,
        onChangeFoundedYear,
        onChangeDescription,
        editableLinks,
        onAddLink,
        onChangeCountry,
        onChangeRegion,
        onNextPress,
    } = useWineryDetails();
    const {
        title: regionModalTitle,
        isVisible: isRegionModalVisible,
        isDisabled: isRegionPickerDisabled,
        selectedText: selectedRegionText,
        options: regionOptions,
        onOpen: onOpenRegionModal,
        onClose: onCloseRegionModal,
        onConfirm: onConfirmRegion,
    } = useWineryRegionModal({
        value: form.regionId,
        countryId: form.country?.id,
        regions,
        onChange: onChangeRegion,
    });

    return (
        <>
            <ScreenContainer
                edges={['top', 'bottom']}
                headerComponent={<HeaderWithBackButton />}
                isKeyboardAvoiding
                scrollEnabled
            >
                <View style={styles.container}>
                    <View style={styles.mainContainer}>
                        <Typography text={t('registration.wineryDetails')} variant="h3" style={styles.title} />
                        <Typography text={t('wineLevel.creator')} variant="body_500" style={styles.role} />
                        <View style={styles.formContainer}>
                            <CustomInput
                                value={form.name}
                                onChangeText={onChangeName}
                                placeholder={t('registration.wineryName')}
                                containerStyle={styles.input}
                            />
                            <CustomInput
                                value={form.foundedYear}
                                onChangeText={onChangeFoundedYear}
                                placeholder={t('registration.foundedYear')}
                                keyboardType="number-pad"
                                containerStyle={styles.input}
                            />
                            <CustomInput
                                value={form.description}
                                onChangeText={onChangeDescription}
                                placeholder={t('registration.wineryDescription')}
                                maxLength={500}
                                multiline
                                containerStyle={styles.input}
                                inputContainerStyle={styles.inputMultiline}
                            />
                            <CountrySelector
                                country={form.country}
                                onChangeCountry={onChangeCountry}
                                countries={countries}
                            />
                            <PickerButton
                                text={selectedRegionText}
                                placeholder={t('registration.region')}
                                onPress={onOpenRegionModal}
                                isDisabled={isRegionPickerDisabled}
                            />
                            <EditableRegistrationLinks
                                items={editableLinks}
                                label={t('registration.wineryLinks')}
                                placeholder={t('registration.link')}
                                addText={t('registration.addLink')}
                                onAdd={onAddLink}
                            />
                            {isError.status && <Warning warningText={isError.errorText} />}
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Button
                            text={t('common.continue')}
                            onPress={onNextPress}
                            type="secondary"
                            disabled={isDisabled || isLoading}
                            inProgress={isLoading}
                        />
                        <SignInFooter />
                    </View>
                </View>
            </ScreenContainer>
            {isRegionModalVisible && (
                <UniversalPickerBottomModal
                    visible={isRegionModalVisible}
                    title={regionModalTitle}
                    options={regionOptions}
                    isLoading={false}
                    selectionMode="single"
                    emptyText={t('wine.withoutRegion')}
                    confirmText={t('common.confirm')}
                    onClose={onCloseRegionModal}
                    onConfirm={onConfirmRegion}
                />
            )}
        </>
    );
});
