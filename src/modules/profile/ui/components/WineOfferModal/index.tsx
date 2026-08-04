import { memo, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { IWineOffer } from '@/entities/wine/types/IWineOffer';
import { IWineryLinkedWineOffer } from '@/entities/winery/types/IWineryLinkedWine';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { CustomInput } from '@/UIKit/CustomInput';
import { PickerButton } from '@/UIKit/PickerButton';
import { Button } from '@/UIKit/Button';
import { CurrencyPickerBottomSheet } from '@/UIKit/CurrencyPicker/ui';
import { useWineOfferModal } from './presenters/useWineOfferModal';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    wine: IWineListItem | null;
    offer: IWineryLinkedWineOffer | null;
    onClose: () => void;
    onSaved: (offer: IWineOffer) => void;
    onDeleted: (wineId: number) => void;
    isWinery?: boolean;
}

const WineOfferModalComponent = ({ visible, wine, offer, onClose, onSaved, onDeleted, isWinery = false}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        price,
        currency,
        quantity,
        websiteUrl,
        isSaving,
        isDeleting,
        isSaveDisabled,
        isDeleteVisible,
        isDeleteDisabled,
        isFormEditable,
        isCurrencyPickerDisabled,
        isPriceError,
        isWebsiteUrlError,
        modalTitle,
        currencyPicker,
        onChangePrice,
        onChangeQuantity,
        onChangeWebsiteUrl,
        onModalClose,
        onSave,
        onDelete,
    } = useWineOfferModal({ visible, wine, offer, onClose, onSaved, onDeleted, isWinery });

    return (
        <>
            <BottomModal visible={visible && !currencyPicker.isVisible} onClose={onModalClose} title={modalTitle}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <CustomInput
                        value={price}
                        onChangeText={onChangePrice}
                        label={t('profile.winePrice')}
                        placeholder={t('profile.winePricePlaceholder')}
                        keyboardType="decimal-pad"
                        error={isPriceError}
                        errorText={t('profile.invalidWinePrice')}
                        editable={isFormEditable}
                        containerStyle={styles.inputBeforePicker}
                    />
                    <PickerButton
                        text={currency}
                        label={t('profile.wineCurrency')}
                        placeholder={t('profile.wineCurrency')}
                        onPress={currencyPicker.onOpen}
                        isDisabled={isCurrencyPickerDisabled}
                    />
                    <CustomInput
                        value={websiteUrl}
                        onChangeText={onChangeWebsiteUrl}
                        label={t('profile.wineWebsiteUrl')}
                        placeholder={t('profile.wineWebsiteUrlPlaceholder')}
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                        error={isWebsiteUrlError}
                        errorText={t('profile.invalidWineWebsiteUrl')}
                        editable={isFormEditable}
                        containerStyle={styles.inputAfterPicker}

                    />
                    <CustomInput
                        value={quantity}
                        onChangeText={onChangeQuantity}
                        label={t('profile.wineQuantity')}
                        placeholder={t('profile.wineQuantityPlaceholder')}
                        keyboardType="number-pad"
                        editable={isFormEditable}
                    />
                    <Button
                        text={t('common.save')}
                        onPress={onSave}
                        disabled={isSaveDisabled}
                        inProgress={isSaving}
                        containerStyle={styles.saveButton}
                    />
                    {isDeleteVisible && (
                        <Button
                            text={t('profile.deleteWineOffer')}
                            onPress={onDelete}
                            type="secondary"
                            disabled={isDeleteDisabled}
                            inProgress={isDeleting}
                            containerStyle={styles.deleteButton}
                            textStyle={styles.deleteButtonText}
                        />
                    )}
                </ScrollView>
            </BottomModal>
            {currencyPicker.isVisible ? (
                <CurrencyPickerBottomSheet
                    visible={currencyPicker.isVisible}
                    title={t('profile.wineCurrency')}
                    onClose={currencyPicker.onClose}
                    items={currencyPicker.items}
                    selectedValue={currencyPicker.draft}
                    onConfirm={currencyPicker.onConfirm}
                />
            ) : null}
        </>
    );
};

export const WineOfferModal = memo(WineOfferModalComponent);
WineOfferModal.displayName = 'WineOfferModal';
